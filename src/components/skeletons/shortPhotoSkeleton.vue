<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import TextDivider from "@/components/common/textDivider.vue";
</script>

<template>
<div class="short-ph_sk__wrapper">
  <div class="ph-head mb-2">
    <text-divider text="smth"/>
    <skeleton-loader/>
  </div>
  <div class="short-ph_sk">
    <div class="ph-item" v-for="i in 3" :key="i">
      <skeleton-loader/>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
.short-ph_sk__wrapper{
  width: 100%;
  height: 100%;
}
.short-ph_sk{
  display: flex;
  justify-content: center;
  gap: 10px;


  .ph-item{
    width: 85px;
    min-width: 20px;
    height: 85px;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
  }
}
.ph-head{
  position: relative;
  border-radius: 5px;
}
</style>