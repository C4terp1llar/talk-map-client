<script setup lang="ts">
import GlobalMediaContent from "@/components/common/globalMediaContent.vue";

</script>

<template>
<div class="media__wrapper">
  <global-media-content/>
</div>
</template>

<style scoped lang="scss">
.media__wrapper {
  position: fixed;
  inset: 0;
  z-index: 10003;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}
</style>