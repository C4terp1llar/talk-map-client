<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";
</script>

<template>
  <div class="media-content__wrapper-sk mt-1">
    <div class="photo position-relative">
      <skeleton-loader/>
    </div>
    <div class="content position-relative">
      <skeleton-loader/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.media-content__wrapper-sk {
  display: grid;
  grid-template-rows: repeat(12, 1fr);
  height: inherit;
  gap: 10px;
  padding-top: 20px;
  @media (max-width: 650px) {
    padding-top: unset;
  }
  .photo, .content, .photo-head{
    overflow: hidden;
    width: 100%;
    border-radius: 15px;
  }
  .photo {
    grid-row: span 11;
  }
  .content {
    grid-row: span 1;
  }
}
</style>