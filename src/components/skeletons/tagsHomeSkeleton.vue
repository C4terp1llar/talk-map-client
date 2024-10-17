<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import ScrollableContainer from "@/components/common/scrollableContainer.vue";
</script>

<template>
  <scrollable-container>
    <div class="tags-home-skeleton-wrapper">

      <div
          class="tag-content-wrapper"
          v-for="i in 5"
          :key="i"
      >
        <div class="tag-content">
          <div class="emoji emoji-font">load</div>
          <span class="tag-text">load</span>
          <skeleton-loader/>
        </div>
      </div>
    </div>
  </scrollable-container>
</template>

<style scoped lang="scss">
.tags-home-skeleton-wrapper {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.tag-content-wrapper {
  padding: 2px;
  border-radius: 25px;
  width: fit-content;

  .tag-content {
    overflow: hidden;
    width: fit-content;
    position: relative;
    border-radius: 25px;
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 5px 10px;
    background-color: rgb(var(--v-theme-background));
  }
}

.tag-text {
  font-weight: 600;
  font-size: 14px;
}
</style>