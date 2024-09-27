<script setup lang="ts">
import apiAuth from "@/utils/apiAuth";
import Wallpaper from "@/components/home/wallpaper.vue";
import WallpaperAvatar from "@/components/home/wallpaperAvatar.vue";
import CropperImg from "@/components/common/cropperImg.vue";

const test = async () => {
  try{
    const response = await apiAuth.post('auth/test')
    console.log(response)
  }catch(err){
    console.log(err)
  }

}
</script>

<template>
  <wallpaper>
    <wallpaper-avatar/>
  </wallpaper>
</template>

<style scoped>

</style>