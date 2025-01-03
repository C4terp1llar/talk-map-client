<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";
</script>

<template>
<div class="mt-2 mb-2 comments__sk">
  <div class="i__sk"><skeleton-loader/></div>
  <div class="i__sk"><skeleton-loader/></div>
  <div class="i__sk"><skeleton-loader/></div>
</div>
</template>

<style scoped lang="scss">
.comments__sk{
  display: flex;
  flex-direction: column;
  gap: 10px;
  .i__sk{
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
  }
}
</style>