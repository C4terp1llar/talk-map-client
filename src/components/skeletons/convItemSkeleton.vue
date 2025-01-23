<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";
</script>

<template>
  <div class="group-conversation-skeleton __default">
    <div class="group-conversation-skeleton__cover __default">
      <skeleton-loader class="child-loader" :brightness="0.7"/>
    </div>
    <div class="group-conversation-skeleton__details __default child-loader">
      <div class="group-conversation-skeleton__details-title __default">
        <skeleton-loader class="child-loader" :brightness="0.7"/>
      </div>
      <div class="group-conversation-skeleton__details-content __default">
        <skeleton-loader class="child-loader" :brightness="0.7"/>
      </div>
      <div class="group-conversation-skeleton__details-time __default">
        <skeleton-loader class="child-loader" :brightness="0.7"/>
      </div>

    </div>

    <skeleton-loader class="parent-loader"/>
  </div>
</template>

<style scoped lang="scss">
.__default{
  position: relative;
  overflow: hidden;
}
.group-conversation-skeleton{
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 10px;

  .group-conversation-skeleton__cover{
    height: 40px;
    width: 40px;
    border-radius: 50%;
    grid-column: span 1;
  }

  .group-conversation-skeleton__details{
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
    grid-column: span 1;
    .group-conversation-skeleton__details-title{
      border-radius: 3px;
      height: 7px;
      width: 50%;
      margin-right: auto;
    }
    .group-conversation-skeleton__details-content{
      border-radius: 4px;
      height: 13px;
      width: 100%;
    }
    .group-conversation-skeleton__details-time{
      border-radius: 2px;
      height: 5px;
      width: 25%;
      margin-left: auto;
    }
  }

}
.parent-loader{
  z-index: 1;
}
.child-loader{
  z-index: 2;
}
</style>