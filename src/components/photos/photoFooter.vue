<script setup lang="ts">
import {usePhotoStore} from "@/stores/photo";

const phStore = usePhotoStore();

</script>

<template>
  <div class="media-content__footer" v-if="typeof phStore.currentGListIndex === 'number' && phStore.phGList?.length">
    <span>{{`Фотографии ${phStore.currentPhoto?.nickname} - ${phStore.currentGListIndex + 1} из ${phStore.phGList?.length}`}}</span>
  </div>
</template>

<style scoped lang="scss">
.media-content__footer{
  width: 100%;
  display: flex;
  justify-content: center;
  span{
    opacity: 0.8;
    font-size: 11px;
    font-weight: 500;
    color: grey;
  }
}
</style>