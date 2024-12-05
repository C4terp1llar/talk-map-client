<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";

interface Props {
  isShort?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <div class="mutual-friends-popup__list_item">
    <div :class="['mutual-friends-popup__list_item__avatar', props.isShort ? '__short' : '']">
      <skeleton-loader/>
    </div>
    <div class="mutual-friends-popup__list_item__nickname position-relative">
      <span>nicknam</span>
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

  .mutual-friends-popup__list_item__nickname{
    @media screen and (max-width: 1050px) {
      font-size: 12px;
    }
  }

  .mutual-friends-popup__list_item__avatar {
    position: relative;
    overflow: hidden;
    min-width: 100px;
    min-height: 100px;
    border-radius: 50%;

    &.__short{
      min-width: 70px !important;
      min-height: 70px !important;
      @media screen and (max-width: 1050px) {
        min-width: 55px !important;
        min-height: 55px !important;
      }
    }

    @media screen and (max-width: 1050px) {
      min-width: 65px;
      min-height: 65px;
    }

    @media screen and (max-width: 900px) {
      min-width: 50px;
      min-height: 50px;
    }
  }
}


</style>