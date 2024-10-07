<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import ChangeWallpaperMenu from "@/components/home/changeWallpaperMenu.vue";
import {useRouter} from "vue-router";
import {useProfilePreviewStore} from "@/stores/profilePreview";
import WallpaperBottomContentSkeleton from "@/components/skeletons/wallpaperBottomContentSkeleton.vue";

const userStore = useUserStore()
const profilePreview = useProfilePreviewStore();

const router = useRouter()

interface Props {
  withActions: boolean,
  isPreview?: boolean
}
const props = defineProps<Props>()
</script>

<template>
  <div class="wallpaper-block">

    <change-wallpaper-menu v-if="props.withActions"/>

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

      <div class="bottom-wallpaper-block-content" v-if="!userStore.pending">

        <div class="info-block">
          <h4
              class="user-nickname"
              :style="{ color: props.isPreview ? profilePreview.newUserNicknameColor || userStore.mainUserInfo?.nickname_color || 'currentColor' : userStore.mainUserInfo?.nickname_color || 'currentColor' }"
          >
            {{ props.isPreview ? profilePreview.newUserNickname || userStore.mainUserInfo?.nickname : userStore.mainUserInfo?.nickname }}
          </h4>

          <div class="user-location" v-if="userStore.userAddressInfo?.city">
            <i :class="`flag fi fi-${userStore.userAddressInfo.country_code}`"></i>
            <span>{{ `${userStore.userAddressInfo?.city}, ${userStore.userAddressInfo.country}` }}</span>
          </div>
        </div>

        <div class="actions-block">
          <v-btn
              v-if="props.withActions"
              variant="tonal"
              class="text-none"
              prepend-icon="mdi-palette-outline"
              @click="router.push({name: 'settings-profile'})"
          >
            Настроить
          </v-btn>
        </div>
      </div>
      <wallpaper-bottom-content-skeleton v-else/>


    </div>
  </div>
</template>

<style scoped lang="scss">
.wallpaper-block {
  position: relative;
  box-shadow: 0 1px 10px currentColor;
  border-radius: 15px;
  background: rgb(var(--v-theme-background));


  .wallpaper-img-block {
    position: relative;
    border-radius: 15px;
    overflow: hidden;
    height: 200px;

    .wallpaper-img, .without-wallpaper {
      height: inherit;
    }

    .without-wallpaper {
      background: linear-gradient(150deg, rgb(var(--v-theme-background)), #4CAF50);
    }
  }

  .bottom-wallpaper-block {
    position: relative;
    background: rgb(var(--v-theme-background));
    border-radius: 15px;
    display: flex;

    @media (max-width: 850px) {
      flex-direction: column;
    }

    .wallpaper-avatar-block {
      position: absolute;
      top: -75px;
      left: 25px;
      @media (max-width: 850px) {
        width: 100%;
        top: -50px;
        left: 0;
        display: flex;
        justify-content: center;
      }
    }

    .wallpaper-avatar-block-relative-mask {
      min-height: 75px;
      min-width: 200px;
      @media (max-width: 850px) {
        min-width: unset;
        min-height: 50px;
      }
    }

    .bottom-wallpaper-block-content {
      z-index: 1;
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 15px 15px 15px 0;

      @media (max-width: 850px) {
        padding: 0 15px 15px 15px;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
      @media (max-width: 500px) {
        flex-direction: column;
      }

      .info-block{
        display: flex;
        flex-direction: column;

        @media (max-width: 850px) {
          align-items: center;
          justify-content: center;
        }
      }

      .user-location {
        display: flex;
        align-items: center;
        gap: 10px;

        span {
          font-size: 14px;
          font-weight: bold;
          opacity: .8;
        }

        .flag {
          box-shadow: 0 0 5px currentColor;
          border-radius: 15%;
        }
      }
    }
  }
}
</style>