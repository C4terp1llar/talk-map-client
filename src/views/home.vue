<script setup lang="ts">
import Wallpaper from "@/components/home/wallpaper.vue";
import WallpaperAvatar from "@/components/home/wallpaperAvatar.vue";
import TagsHome from "@/components/home/tagsHome.vue";
import {useWsStore} from "@/stores/wsStore";


</script>

<template>
  <div class="home-page-wrapper">
    <wallpaper :with-actions="true">
      <wallpaper-avatar :with-actions="true" :is-preview="false"/>
    </wallpaper>

    <tags-home/>

  </div>

</template>

<style scoped>
.home-page-wrapper{
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>