<script setup lang="ts">
import AppBar from "./components/AppBar.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <UApp>
    <!-- Nav Bar / App Bar -->
    <AppBar />

    <!-- Content -->
    <RouterView />
  </UApp>
</template>
