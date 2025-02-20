<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";
</script>

<template>
  <div class="sk__wrapper">
    <div class="__avatar">
      <div class="__bl">
        <skeleton-loader/>
      </div>
    </div>
    <div class="__heading">
      <div class="__bl">
        <skeleton-loader/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sk__wrapper{
  position: relative;
  width: 100%;
  .__avatar{
    .__bl{
      border-radius: 50%;
      overflow: hidden;
      height: 150px;
      width: 150px;
      position: relative;
      @media (max-width: 650px){
        height: 100px;
        width: 100px;
      }
    }
  }
  .__heading{
    margin: 8px;
    .__bl{
      position: relative;
      width: 350px;
      height: 25px;
      border-radius: 10px;
    }
  }
  .__heading, .__avatar{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .__bl{
    position: relative;
    overflow: hidden;
  }
}
</style>