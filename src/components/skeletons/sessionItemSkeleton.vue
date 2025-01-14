<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";
</script>

<template>
  <div class="session-item__sk mb-2">
    <div class="session-item__detail-sk w-75 mr-auto">
      <skeleton-loader :brightness="0.7"/>
    </div>
    <div class="session-item__detail-sk w-50 mr-auto">
      <skeleton-loader :brightness="0.7"/>
    </div>
    <div class="session-item__detail-sk w-25 ml-auto">
      <skeleton-loader :brightness="0.7"/>
    </div>

    <skeleton-loader class="parent-loader"/>
  </div>
</template>

<style scoped lang="scss">
.session-item__sk{
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
  border-radius: 10px;
  overflow: hidden;

  .parent-loader{
    z-index: 1;
  }

  .session-item__detail-sk{
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    height: 15px;
    z-index: 2;
  }

}
</style>