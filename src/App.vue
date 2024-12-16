<script setup lang="ts">

import {useAppThemeStore} from "@/stores/appTheme";
import Notification from "@/components/common/notification.vue";
import GlobalLoader from "@/components/globalLoader.vue";
import {pending} from "@/utils/refreshStore";
import ImgPopup from "@/components/imgPopup/imgPopup.vue";
import GlobalMedia from "@/components/common/globalMedia.vue";
import {useRoute} from "vue-router";
import {computed} from "vue";

const route = useRoute()

const appThemeStore = useAppThemeStore()
const isMediaModalVisible = computed(() => route.query.r && route.query.u);
</script>

<template>
  <v-app :theme="appThemeStore.currentTheme">
    <global-loader v-if="pending"/>
    <RouterView v-else/>

    <notification/>

    <v-dialog-transition>
      <img-popup/>
    </v-dialog-transition>

    <global-media v-if="isMediaModalVisible"/>
  </v-app>
</template>

<style scoped>

</style>
