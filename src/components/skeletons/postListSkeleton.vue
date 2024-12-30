<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";
</script>

<template>
<div class="post-list-sk__wrapper">
  <div class="sk__item"><skeleton-loader/></div>
  <div class="sk__item"><skeleton-loader/></div>
  <div class="sk__item"><skeleton-loader/></div>
</div>
</template>

<style scoped lang="scss">
.post-list-sk__wrapper{
  height: inherit;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  .sk__item{
    height: 40px;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
  }
}
</style>