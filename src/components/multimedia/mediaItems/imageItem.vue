<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import type { MediaConvInfo } from "@/helpers/interfaces";

interface Props {
  m: MediaConvInfo;
}

defineProps<Props>();
const imgWrapper = ref<HTMLElement | null>(null);
const image = ref<HTMLImageElement | null>(null);

const updateGridRow = async () => {
  await nextTick();

  if (imgWrapper.value && image.value) {
    const imageHeight = image.value.offsetHeight;
    const rowSpan = Math.ceil(imageHeight / 10);

    imgWrapper.value.style.gridRowEnd = `span ${rowSpan}`;
  }
};

onMounted(() => {
  if (image.value?.complete) {
    updateGridRow();
  }
});
</script>

<template>
  <div class="image-item__wrapper" ref="imgWrapper">
    <img
        :src="m.store_url"
        :alt="m.client_filename"
        @load="updateGridRow"
        ref="image"
    />
  </div>
</template>

<style scoped lang="scss">
.image-item__wrapper {
  display: grid;
  height: auto;
}

img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 0 2px grey;
}
</style>
