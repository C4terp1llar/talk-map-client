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

    <v-img
        :src="userStore.userWallpaper || userStore.mainUserInfo?.wallpaper || 'https://i.ibb.co/3yMfWxN/wallpaper-bg.jpg'"
        class="wallpaper-img"
        cover
        alt="wallpaper"
    >
      <template v-slot:placeholder>
          <skeleton-loader/>
      </template>
    </v-img>

    <skeleton-loader v-if="userStore.pending || userStore.wallpaperPending"/>

    <!--    это для аватарки -->
    <slot></slot>

    <div class="bottom-wallpaper-block">
      <div class="info">
        <div class="user-info" v-if="!userStore.pending">
          <h3>{{ userStore.mainUserInfo?.nickname }}</h3>
        </div>
        <skeleton-loader v-else/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wallpaper-block {
  position: relative;
  border-radius: 15px;

  display: flex;
  box-shadow: 0 1px 10px currentColor;

  height: 300px;

  @media screen and (max-width: 850px) {
    justify-content: center;
  }

  .wallpaper-img {
    position: absolute;
    inset: 0;
    width: 100%;
    object-fit: cover;
    min-height: 70%;
    max-height: 75%;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }

  .wallpaper-loader {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .bottom-wallpaper-block {
    position: absolute;
    width: 100%;
    height: 30%;
    bottom: 0;
    background: rgb(var(--v-theme-background));
    border-radius: 15px;
    overflow: hidden;

    display: flex;
    align-items: center;
    padding: 0 10px 0 175px;

    @media screen and (max-width: 850px) {
      padding: 30px 10px 10px 10px;
    }
    .info {
      width: 100%;
      padding: 10px;
      overflow: hidden;
      border-radius: 15px;
      position: relative;
      display: flex;

      @media screen and (max-width: 850px) {
        justify-content: center;
      }
    }
  }
}
</style>