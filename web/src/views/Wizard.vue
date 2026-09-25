<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { createSHA256 } from "hash-wasm";
import type { RadioGroupItem } from "@nuxt/ui";
import GuideRippingButton from "../components/guides/GuideRippingButton.vue";
import { randomize } from "../iso/runRandomizer";

const difficultyOptions = ref<RadioGroupItem[]>([
  {
    label: "Normal",
    description:
      "Non-Rival Opponents will have the same number of moves, traits, and total stats per the average monster in their rank",
    value: "normal",
  },
  // {
  //   label: "Hard",
  //   description:
  //     "Non-Rival Opponents will can have more moves, traits, and higher total stats (up to 25% more) than the average monster in their rank",
  //   value: "hard",
  // },
]);

const difficulty = ref("normal");
const currentStep = ref<number>(1);

const EXPECTED_MR3_SHA256 =
  "7e21aa098e18bc5bc242de3fe770cac042f50bc8100b71588c84b5e2dc3c3a43".toLowerCase();

type IsoValidationState = "idle" | "validating" | "valid" | "invalid" | "error";

const selectedIso = ref<File | null>(null);
const validatedIso = ref<File | null>(null);

const isoValidationState = ref<IsoValidationState>("idle");
const detectedIsoHash = ref<string | null>(null);
const isoValidationError = ref<string | null>(null);

const randomizationProgress = ref(0);

type RandomizationState = "idle" | "running" | "complete" | "error";

const randomizationState = ref<RandomizationState>("idle");
const randomizationError = ref<string | null>(null);

const randomizedFile = ref<File | null>(null);
const isPreparingDownload = ref(false);

const progressPercent = computed(() =>
  Math.round(randomizationProgress.value * 100),
);

const randomizedIsoSize = computed(() => {
  const file = randomizedFile.value;

  if (!file) {
    return null;
  }

  return `${(file.size / 1024 ** 3).toFixed(2)} GB`;
});

/*
 * Deletes the randomized ISO from OPFS.
 *
 * Retained until the tab closes or the user navigates away
 * from the wizard, so the download is never interrupted
 * by cleanup.
 */
let pendingCleanup: (() => Promise<void>) | null = null;

const hasPendingResources = computed(
  () =>
    randomizationState.value === "running" ||
    (randomizationState.value === "complete" && pendingCleanup !== null),
);

/*
 * Incremented whenever the selected file changes.
 *
 * This prevents an older validation from finishing later
 * and overwriting the state for a newer file.
 */
let validationGeneration = 0;

async function hashFileSha256(
  file: File,
  generation: number,
): Promise<string | null> {
  const hasher = await createSHA256();
  hasher.init();

  const reader = file.stream().getReader();

  try {
    while (true) {
      /*
       * If another file was selected while this one was
       * hashing, stop this validation.
       */
      if (generation !== validationGeneration) {
        await reader.cancel();
        return null;
      }

      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      /*
       * Only the current stream chunk is held in memory.
       */
      hasher.update(value);
    }

    if (generation !== validationGeneration) {
      return null;
    }

    return hasher.digest("hex").toLowerCase() as string;
  } finally {
    reader.releaseLock();
  }
}

watch(selectedIso, async (file) => {
  const generation = ++validationGeneration;

  validatedIso.value = null;
  detectedIsoHash.value = null;
  isoValidationError.value = null;

  if (!file) {
    isoValidationState.value = "idle";
    return;
  }

  if (!file.name.toLowerCase().endsWith(".iso")) {
    isoValidationState.value = "invalid";
    isoValidationError.value = "Please select an .iso file.";
    return;
  }

  isoValidationState.value = "validating";

  try {
    const hash = await hashFileSha256(file, generation);

    /*
     * This validation was superseded by another file.
     */
    if (hash === null || generation !== validationGeneration) {
      return;
    }

    detectedIsoHash.value = hash;

    if (hash !== EXPECTED_MR3_SHA256) {
      isoValidationState.value = "invalid";
      isoValidationError.value =
        "This ISO could not be validated. Its SHA-256 does not match the supported Monster Rancher 3 ISO.";

      return;
    }

    validatedIso.value = file;
    isoValidationState.value = "valid";
  } catch (error) {
    if (generation !== validationGeneration) {
      return;
    }

    console.error("Failed to validate ISO:", error);

    isoValidationState.value = "error";
    isoValidationError.value =
      "The ISO could not be validated. Please try selecting it again.";
  }
});

function continueFromIsoStep() {
  if (isoValidationState.value !== "valid" || !validatedIso.value) {
    return;
  }

  currentStep.value = 3;
}

async function startRandomization() {
  if (!validatedIso.value || randomizationState.value !== "idle") {
    return;
  }

  currentStep.value = 4;
  randomizationProgress.value = 0;
  randomizationError.value = null;

  if (!(await hasFreeStorage(validatedIso.value.size))) {
    randomizationState.value = "error";
    randomizationError.value =
      "There is not enough free storage available to randomize this ISO. Free up some disk space and try again.";

    return;
  }

  randomizationState.value = "running";

  try {
    const { file, cleanup } = await randomize(
      validatedIso.value,
      (progress: number) => {
        randomizationProgress.value = progress;
      },
    );

    pendingCleanup = cleanup;
    randomizedFile.value = file;

    randomizationState.value = "complete";
    currentStep.value = 5;
  } catch (error) {
    console.error("Randomization failed:", error);

    randomizationState.value = "error";
    randomizationError.value =
      "The ISO could not be randomized. Please try again.";
  }
}

function retryRandomization() {
  randomizationState.value = "idle";
  randomizedFile.value = null;

  void startRandomization();
}

function backToSettings() {
  randomizationState.value = "idle";
  randomizationError.value = null;
  randomizedFile.value = null;

  /*
   * Going back discards the randomized ISO.
   * Re-randomizing produces a fresh one anyway.
   */
  void discardRandomizedIso();

  currentStep.value = 3;
}

function downloadRandomizedIso(): void {
  const file = randomizedFile.value;

  if (!file || isPreparingDownload.value) {
    return;
  }

  isPreparingDownload.value = true;
  downloadFile(file, "MR3-Randomized.iso");

  /*
   * The browser copies the full ISO out of OPFS before
   * the download begins, with no progress signal exposed.
   * Keep the loading state for a while so it is clear
   * that something is happening, then allow a retry.
   */
  setTimeout(() => {
    isPreparingDownload.value = false;
  }, 15_000);
}

async function hasFreeStorage(requiredBytes: number): Promise<boolean> {
  try {
    const estimate = await navigator.storage.estimate();

    if (estimate.quota == null || estimate.usage == null) {
      return true;
    }

    return estimate.quota - estimate.usage >= requiredBytes;
  } catch {
    return true;
  }
}

async function discardRandomizedIso() {
  const cleanup = pendingCleanup;
  pendingCleanup = null;

  try {
    await cleanup?.();
  } catch (error) {
    console.error("Failed to clean up randomized ISO:", error);
  }
}

function onBeforeUnload(event: BeforeUnloadEvent) {
  if (hasPendingResources.value) {
    event.preventDefault();
  }
}

function onPageHide() {
  void discardRandomizedIso();
}

onMounted(() => {
  window.addEventListener("beforeunload", onBeforeUnload);
  window.addEventListener("pagehide", onPageHide);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", onBeforeUnload);
  window.removeEventListener("pagehide", onPageHide);

  void discardRandomizedIso();
});

onBeforeRouteLeave(async () => {
  if (!hasPendingResources.value) {
    return;
  }

  const message =
    randomizationState.value === "running"
      ? "Randomization is still in progress. If you leave now, it will be cancelled and its temporary files will be discarded. Leave anyway?"
      : "Your randomized ISO has not been downloaded yet, or its download is still in progress. If you leave now, the download may be interrupted and its temporary files will be discarded. Leave anyway?";

  if (!window.confirm(message)) {
    return false;
  }

  await discardRandomizedIso();
});

function downloadFile(file: File, filename: string): void {
  const url = URL.createObjectURL(file);

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";

  document.body.appendChild(anchor);

  anchor.click();
  anchor.remove();

  /*
   * Don't revoke synchronously.
   * Let the browser start consuming it first.
   *
   * The ISO is large enough that the download can take
   * several minutes, so keep the blob alive well past
   * the point where the download begins.
   */
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 600_000);
}
</script>

<template>
  <!-- Step 1. Review Requirements -->
  <UPageCard
    v-if="currentStep === 1"
    title="Step 1. Review Requirements"
    icon="i-lucide-list"
    class="w-lg"
  >
    <template #description>
      <ul class="pt-2">
        <li>
          Ensure that you're using the <strong>v1.1 version</strong> of the MR3
          ISO
        </li>
        <li>
          Ensure that you're using your <strong>legal copy</strong> of the MR3
          ISO
          <ul>
            <li>Do not use pirated copies of the MR3 ISO</li>
            <li>
              If you own MR3 but do not know how to rip your ISO, refer to the
              guide below
            </li>
          </ul>
        </li>
        <li>
          Ensure that you have at least <strong>10 GB</strong> of free disk
          space
          <ul>
            <li>
              This ensures that there is enough space for both the final
              randomized ISO and the temporary files needed for randomization.
            </li>
            <li>
              During randomization, temporary files will be created that require
              this additional disk space, but they will be cleaned up after
              randomization
            </li>
          </ul>
        </li>
      </ul>

      <section class="flex flex-row-reverse gap-x-3 pt-4">
        <UButton
          icon="i-lucide-check"
          size="md"
          class="cursor-pointer"
          @click="currentStep = 2"
        >
          I Understand
        </UButton>
        <GuideRippingButton />
      </section>
    </template>
  </UPageCard>

  <!-- Step 2. Load your ISO -->
  <UPageCard
    v-if="currentStep === 2"
    title="Step 2. Load your ISO"
    icon="i-lucide-disc-3"
    class="w-lg"
    :ui="{ body: 'w-full' }"
  >
    <template #description>
      <UFileUpload
        v-model="selectedIso"
        position="inside"
        layout="list"
        accept=".iso"
        label="Drop your MR3 .ISO here"
        description="Must be a legal supported MR3 ISO"
        class="w-full"
        :ui="{
          base: 'min-h-48',
        }"
      />

      <!-- Successful validation -->
      <UAlert
        v-if="isoValidationState === 'valid'"
        class="mt-3"
        color="success"
        variant="subtle"
        icon="i-lucide-circle-check"
        title="ISO successfully validated."
      />

      <!-- Invalid hash -->
      <UAlert
        v-else-if="isoValidationState === 'invalid'"
        class="mt-3"
        color="error"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        title="ISO could not be validated."
      >
        <template #description>
          <p>
            {{ isoValidationError }}
          </p>

          <p v-if="detectedIsoHash" class="mt-2 break-all font-mono text-xs">
            Detected SHA-256:
            {{ detectedIsoHash }}
          </p>
        </template>
      </UAlert>

      <!-- Unexpected hashing error -->
      <UAlert
        v-else-if="isoValidationState === 'error'"
        class="mt-3"
        color="error"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        title="Validation failed."
        :description="isoValidationError ?? undefined"
      />

      <section class="flex flex-row-reverse gap-x-3 pt-4">
        <UButton
          :icon="
            isoValidationState === 'validating'
              ? undefined
              : 'i-lucide-arrow-right'
          "
          :loading="isoValidationState === 'validating'"
          :disabled="isoValidationState !== 'valid'"
          size="md"
          class="cursor-pointer"
          @click="continueFromIsoStep"
        >
          {{ isoValidationState === "validating" ? "Validating" : "Continue" }}
        </UButton>

        <GuideRippingButton />
      </section>
    </template>
  </UPageCard>

  <!-- Step 3. Basic Settings -->
  <UPageCard
    v-if="currentStep === 3"
    title="Step 3. Randomizer Settings"
    icon="i-lucide-gear"
    class="w-lg"
    :ui="{ body: 'w-full' }"
  >
    <template #description>
      <URadioGroup
        class="py-3"
        v-model="difficulty"
        :items="difficultyOptions"
      />

      <section class="flex flex-row-reverse gap-x-3 pt-4">
        <UButton
          icon="i-lucide-arrow-right"
          size="md"
          class="cursor-pointer"
          @click="startRandomization"
        >
          Continue
        </UButton>
      </section>
    </template>
  </UPageCard>

  <!-- Step 4. Randomization -->
  <UPageCard
    v-if="currentStep === 4"
    title="Randomizing"
    icon="i-lucide-disc-3"
    class="w-lg"
    :ui="{ body: 'w-full text-center' }"
  >
    <template #description>
      <div class="flex flex-col items-center gap-y-4">
        <DiscRandomizerLoader autoStart />

        <template v-if="randomizationState === 'running'">
          <UProgress v-model="progressPercent" :max="100" class="w-full" />

          <span>Randomizing... {{ progressPercent }}%</span>
        </template>

        <UAlert
          v-else-if="randomizationState === 'error'"
          class="w-full text-left"
          color="error"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          title="Randomization failed."
          :description="randomizationError ?? undefined"
        />

        <section
          v-if="randomizationState === 'error'"
          class="flex flex-row-reverse gap-x-3 self-end"
        >
          <UButton
            icon="i-lucide-rotate-ccw"
            size="md"
            class="cursor-pointer"
            @click="retryRandomization"
          >
            Retry
          </UButton>

          <UButton
            variant="outline"
            size="md"
            class="cursor-pointer"
            @click="backToSettings"
          >
            Back
          </UButton>
        </section>
      </div>
    </template>
  </UPageCard>

  <!-- Step 5. Download your ISO -->
  <UPageCard
    v-if="currentStep === 5"
    title="Download your ISO"
    icon="i-lucide-download"
    class="w-lg"
    :ui="{ body: 'w-full' }"
  >
    <template #description>
      <div class="flex flex-col gap-y-4">
        <UAlert
          color="success"
          variant="subtle"
          icon="i-lucide-circle-check"
          title="Randomization complete."
          description="Temporary files are cleaned up when you leave this page."
        />

        <div
          class="flex items-center gap-x-3 rounded-lg border border-default p-3"
        >
          <UIcon name="i-lucide-disc-3" class="size-8 shrink-0 text-primary" />

          <div class="flex min-w-0 flex-col">
            <span class="truncate font-medium">MR3-Randomized.iso</span>
            <span v-if="randomizedIsoSize" class="text-sm text-muted">
              {{ randomizedIsoSize }}
            </span>
          </div>
        </div>

        <UAlert
          color="warning"
          variant="subtle"
          icon="i-lucide-hourglass"
          title="Please be patient after clicking download."
          description="The ISO is large, so your browser may take up to a minute to prepare it before the download begins. The page may appear unresponsive during this time. This is normal."
        />

        <section class="flex flex-row-reverse gap-x-3">
          <UButton
            icon="i-lucide-download"
            size="md"
            class="cursor-pointer"
            :loading="isPreparingDownload"
            :disabled="!randomizedFile"
            @click="downloadRandomizedIso"
          >
            {{ isPreparingDownload ? "Preparing download" : "Download ISO" }}
          </UButton>

          <UButton
            variant="outline"
            size="md"
            class="cursor-pointer"
            @click="backToSettings"
          >
            Back
          </UButton>
        </section>
      </div>
    </template>
  </UPageCard>
</template>
