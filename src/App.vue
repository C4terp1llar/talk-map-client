<script setup lang="ts">

import {useAppThemeStore} from "@/stores/appTheme";

const appThemeStore = useAppThemeStore()

</script>

<template>
  <v-app :theme="appThemeStore.currentTheme">
    <RouterView />
  </v-app>
</template>

<style scoped>

</style>
