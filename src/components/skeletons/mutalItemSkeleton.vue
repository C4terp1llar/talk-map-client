<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";
</script>

<template>
  <div class="mutual-friends-popup__list_item">
    <div class="mutual-friends-popup__list_item__avatar">
      <skeleton-loader/>
    </div>
    <div class="mutual-friends-popup__list_item__nickname position-relative">
      <span>nickname</span>
      <skeleton-loader/>
    </div>
  </div>
</template>

<style scoped lang="scss">

.mutual-friends-popup__list_item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px;
  color: rgb(var(--v-theme-background));


  .mutual-friends-popup__list_item__avatar {
    position: relative;
    overflow: hidden;
    min-width: 100px;
    min-height: 100px;
    border-radius: 50%;

    @media screen and (max-width: 768px) {
      min-width: 80px;
      min-height: 80px;
    }
  }
}


</style>