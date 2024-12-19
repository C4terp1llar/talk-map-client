<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";

interface Props {
  isShort?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <div :class="['mutual-friends-popup__list_item', props.isShort ? '__short' : '']">
    <div class="mutual-friends-popup__list_item__avatar">
      <div :class="['avatar', props.isShort ? '__short' : '']">
        <skeleton-loader/>
      </div>
    </div>

    <div class="mutual-friends-popup__list_item__nickname position-relative">
      <span>nick</span>
      <skeleton-loader/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mutual-friends-popup__list_item {
  display: flex;
  flex-direction: column;

  gap: 5px;
  padding: 10px;
  width: 117px;
  height: 117px;

  &.__short {
    padding: 0;
    width: 82px;
    height: 82px;

    @media screen and (max-width: 550px){
      width: 67px;
      height: 67px;
    }

    .nickname-txt{
      font-size: 14px;
    }
  }


  .mutual-friends-popup__list_item__avatar {
    position: relative;
    overflow: hidden;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .avatar{
      position: relative;
      width: 67px;
      height: 67px;
      border-radius: 50%;
      overflow: hidden;

      &.__short{
        width: 50px;
        height: 50px;

        @media screen and (max-width: 550px){
          width: 38px;
          height: 38px;
        }
      }
    }



  }

}
</style>