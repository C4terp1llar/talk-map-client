<script setup lang="ts">

import {useAppThemeStore} from "@/stores/appTheme";
import Notification from "@/components/common/notification.vue";

const appThemeStore = useAppThemeStore()
</script>

<template>
  <v-app :theme="appThemeStore.currentTheme">
    <RouterView/>
    <notification/>
  </v-app>
</template>

<style scoped>

</style>
