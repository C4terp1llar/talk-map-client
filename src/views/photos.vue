<script setup lang="ts">
import PhotosList from "@/components/photos/photosList.vue";
import PhotosControls from "@/components/photos/photosControls.vue";
import {usePhotoStore} from "@/stores/photo";
import {onMounted} from "vue";

const photoStore = usePhotoStore()
</script>

<template>
  <div class="photos-page__wrapper">
    <photos-controls/>
    <photos-list mode="internal"/>
  </div>
</template>

<style scoped lang="scss">
.photos-page__wrapper{
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 15px;
}
</style>