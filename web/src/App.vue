<script setup lang="ts">
import AppBar from "./components/AppBar.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <UApp>
    <!-- Nav Bar / App Bar -->
    <AppBar />

    <!-- Content -->
    <UPage
      :ui="{
        center:
          'flex flex-col min-h-[calc(100dvh-4rem)] gap-y-10 items-center justify-center',
      }"
    >
      <RouterView />
    </UPage>
  </UApp>
</template>
