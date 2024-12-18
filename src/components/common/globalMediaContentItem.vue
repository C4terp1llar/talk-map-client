<script setup lang="ts">
import PhotoImage from "@/components/photos/photoImage.vue";
import PhotoReactions from "@/components/photos/photoReactions.vue";
import PhotoHeading from "@/components/photos/photoHeading.vue";
import PhotoFooter from "@/components/photos/photoFooter.vue";
import {usePhotoStore} from "@/stores/photo";

const phStore = usePhotoStore();

</script>

<template>
  <div class="media-content" v-if="phStore.currentPhoto && typeof phStore.currentGListIndex === 'number' && phStore.phGList?.length && !phStore.phPending">
    <photo-heading class="mb-2" :photo="phStore.currentPhoto"/>
    <photo-image class="mb-1" :url="phStore.currentPhoto.url"/>
    <photo-footer/>
    <photo-reactions :photo="phStore.currentPhoto"/>
  </div>
</template>

<style scoped lang="scss">
.media-content{
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>