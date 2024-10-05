<script setup lang="ts">

import {useAppThemeStore} from "@/stores/appTheme";
import Notification from "@/components/common/notification.vue";
import GlobalLoader from "@/components/globalLoader.vue";
import {pending} from "@/utils/refreshStore";
import ImgPopup from "@/components/imgPopup/imgPopup.vue";

const appThemeStore = useAppThemeStore()
</script>

<template>
  <v-app :theme="appThemeStore.currentTheme">
    <global-loader v-if="pending"/>
    <RouterView v-else/>

    <notification/>

    <v-dialog-transition>
      <img-popup/>
    </v-dialog-transition>
  </v-app>
</template>

<style scoped>

</style>
