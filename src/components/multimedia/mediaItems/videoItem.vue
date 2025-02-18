<script setup lang="ts">
import type {MediaConvInfo} from "@/helpers/interfaces";

interface Props {
  m: MediaConvInfo;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="video-item__wrapper">
    <video controls class="video-preview">
      <source :src="m.store_url" type="video/mp4"/>
      Ваш браузер не поддерживает видео.
    </video>
  </div>
</template>

<style scoped lang="scss">
.video-item__wrapper {
  display: flex;
  height: auto;
}

video {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 0 2px grey;
}
</style>