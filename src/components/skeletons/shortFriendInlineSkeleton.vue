<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";
</script>

<template>
  <div class="short-friend-inline-sk">
    <div class="short-friend-inline-sk__avatar">
      <skeleton-loader :brightness="0.7"/>
    </div>
    <div class="short-friend-inline-sk__nick">
      <skeleton-loader :brightness="0.7"/>
    </div>
    <skeleton-loader class="parent-loader"/>
  </div>
</template>

<style scoped lang="scss">
.short-friend-inline-sk {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  overflow: hidden;
  border-radius: 10px;

  .short-friend-inline-sk__avatar {
    border-radius: 50%;
    height: 40px;
    width: 45px;
  }

  .short-friend-inline-sk__nick {
    height: 15px;
    width: 100%;
    border-radius: 5px;
  }

  .short-friend-inline-sk__nick, .short-friend-inline-sk__avatar{
    position: relative;
    overflow: hidden;
    z-index: 2;
  }
  .parent-loader{
    z-index: 1;
  }
}
</style>