<script setup lang="ts">
import { ref } from "vue";
import type { RadioGroupItem } from "@nuxt/ui";

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
        <UButton
          icon="i-lucide-circle-question-mark"
          size="md"
          class="cursor-pointer"
          color="primary"
          variant="subtle"
          to="https://pcsx2.net/docs/setup/discs/"
        >
          Guide: Ripping your ISO
        </UButton>
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
        position="inside"
        layout="list"
        multiple
        accept=".iso"
        label="Drop your MR3 .ISO here"
        description="Must be a legal v1.1 MR3 ISO"
        class="w-full"
        :ui="{
          base: 'min-h-48',
        }"
      />
      <section class="flex flex-row-reverse gap-x-3 pt-4">
        <UButton
          icon="i-lucide-arrow-right"
          size="md"
          class="cursor-pointer"
          @click="currentStep = 3"
        >
          Continue
        </UButton>
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
