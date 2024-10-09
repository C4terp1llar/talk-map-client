<script setup lang="ts">
import Wallpaper from "@/components/home/wallpaper.vue";
import WallpaperAvatar from "@/components/home/wallpaperAvatar.vue";

</script>

<template>
  <wallpaper :with-actions="true">
    <wallpaper-avatar :with-actions="true" :is-preview="false"/>
  </wallpaper>

</template>

<style scoped>

</style>