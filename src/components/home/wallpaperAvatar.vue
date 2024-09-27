<script setup lang="ts">
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()

</script>

<template>
  <v-avatar size="150" class="wallpaper-avatar">
    <v-img :src="userStore.mainUserInfo?.avatar" alt="avatar" v-if="!userStore.pending"/>
    <v-skeleton-loader v-else class="wallpaper-loader"></v-skeleton-loader>
  </v-avatar>
</template>

<style scoped lang="scss">
.wallpaper-avatar {
  background: rgb(var(--v-theme-background));
  border: 4px solid rgb(var(--v-theme-background));
  margin: 15px;
  align-self: flex-end;
  z-index: 1000;
  position: relative;
}
.wallpaper-loader{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>