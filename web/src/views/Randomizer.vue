<script setup lang="ts">
import { ref, watch } from "vue";
import { createSHA256 } from "hash-wasm";
import type { RadioGroupItem } from "@nuxt/ui";
import GuideRippingButton from "../components/guides/GuideRippingButton.vue";

const difficultyOptions = ref<RadioGroupItem[]>([
  {
    label: "Normal",
    description:
      "Non-Rival Opponents will have the same number of moves, traits, and total stats per the average monster in their rank",
    value: "normal",
  },
  {
    label: "Hard",
    description:
      "Non-Rival Opponents will can have more moves, traits, and higher total stats (up to 25% more) than the average monster in their rank",
    value: "hard",
  },
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
          @click="currentStep = 4"
        >
          Continue
        </UButton>
      </section>
    </template>
  </UPageCard>

  <!-- Step 4. Randomization -->
  <DiscRandomizerLoader v-if="currentStep === 4" autoStart />
  <UPageCard
    v-if="currentStep === 4"
    title="Randomizing"
    class="w-lg"
    :ui="{ body: 'w-full text-center' }"
  >
    <template #description>
      <span>Please Wait...</span>
    </template>
  </UPageCard>
</template>
