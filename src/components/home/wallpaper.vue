<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import ChangeWallpaperMenu from "@/components/home/changeWallpaperMenu.vue";

const userStore = useUserStore()
</script>

<template>
  <div class="wallpaper-block">

    <change-wallpaper-menu/>

    <div class="wallpaper-img-block">
      <v-img
          v-if="userStore.userWallpaper || userStore.mainUserInfo?.wallpaper"
          :src="userStore.userWallpaper || userStore.mainUserInfo?.wallpaper"
          class="wallpaper-img"
          alt="wallpaper"
          cover
      >
        <template v-slot:placeholder>
          <skeleton-loader/>
        </template>
      </v-img>

      <div class="without-wallpaper" v-else-if="!userStore.userWallpaper || !userStore.mainUserInfo?.wallpaper"></div>

      <skeleton-loader v-if="userStore.pending || userStore.wallpaperPending"/>
    </div>


    <div class="bottom-wallpaper-block text-break">

      <div class="wallpaper-avatar-block">
        <slot></slot>
      </div>

      <div class="wallpaper-avatar-block-relative-mask"></div>


      <div class="bottom-wallpaper-block-content">
        <h3>{{ userStore.mainUserInfo?.nickname }}</h3>

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wallpaper-block {
  position: relative;
  box-shadow: 0 1px 10px currentColor;
  border-radius: 15px;

  .wallpaper-img-block {
    position: relative;
    border-radius: 15px;
    overflow: hidden;
    height: 200px;
    .wallpaper-img, .without-wallpaper{
      height: inherit;
    }
    .without-wallpaper{
      background: linear-gradient(150deg, rgb(var(--v-theme-background)), #4CAF50);
    }
  }



  .bottom-wallpaper-block {
    position: relative;
    background: rgb(var(--v-theme-background));
    border-radius: 15px;
    display: flex;

    @media (max-width: 850px){
      flex-direction: column;
    }

    .wallpaper-avatar-block {
      position: absolute;
      top: -75px;
      left: 25px;
      @media (max-width: 850px){
        width: 100%;
        top: -50px;
        left: 0;
        display: flex;
        justify-content: center;
      }
    }

    .wallpaper-avatar-block-relative-mask{
      min-height: 75px;
      min-width: 200px;
      @media (max-width: 850px){
        min-width: unset;
        min-height: 50px;
      }
    }

    .bottom-wallpaper-block-content{
      z-index: 1;
      display: flex;
      flex-direction: column;
      padding: 15px 15px 15px 0;

      @media (max-width: 850px){
        padding: 0 15px 15px 15px;
      }
    }
  }
}
</style>