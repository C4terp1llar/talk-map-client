<script setup lang="ts">

import {useAppThemeStore} from "@/stores/appTheme";
import Notification from "@/components/common/notification.vue";
import GlobalLoader from "@/components/globalLoader.vue";
import {pending} from "@/utils/refreshStore";
import CropperImg from "@/components/common/cropperImg.vue";


const appThemeStore = useAppThemeStore()
</script>

<template>
  <v-app :theme="appThemeStore.currentTheme">
    <global-loader v-if="pending"/>
    <RouterView v-else/>
    <notification/>
    <cropper-img/>
  </v-app>
</template>

<style scoped>

</style>
