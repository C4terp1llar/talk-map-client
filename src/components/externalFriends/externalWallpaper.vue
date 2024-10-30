<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import ChangeWallpaperMenu from "@/components/home/changeWallpaperMenu.vue";
import {useRouter} from "vue-router";
import {useProfilePreviewStore} from "@/stores/profilePreview";
import WallpaperBottomContentSkeleton from "@/components/skeletons/wallpaperBottomContentSkeleton.vue";
import TagList from "@/components/settings/profile/tagList.vue";
import ScrollableContainer from "@/components/common/scrollableContainer.vue";
import {useExternalUserStore} from "@/stores/externalUser";
import {useNotificationStore} from "@/stores/notifications";
import ExternalActions from "@/components/externalFriends/externalActions.vue";

const externalStore = useExternalUserStore();

</script>

<template>
  <div class="wallpaper-block">

    <external-actions/>

    <div class="wallpaper-img-block">
      <v-img
          v-if="externalStore.main?.wallpaper"
          :src="externalStore.main?.wallpaper"
          class="wallpaper-img"
          alt="wallpaper"
          cover
      >
        <template v-slot:placeholder>
          <skeleton-loader/>
        </template>
      </v-img>

      <div class="without-wallpaper" v-else-if="!externalStore.main?.wallpaper"></div>

      <skeleton-loader v-if="externalStore.pending"/>
    </div>


    <div class="bottom-wallpaper-block text-break">

      <div class="wallpaper-avatar-block">
        <slot></slot>
      </div>

      <div class="wallpaper-avatar-block-relative-mask"></div>


      <div class="bottom-wallpaper-block-content" v-if="!externalStore.pending">

        <div class="info-block">
          <h4
              class="user-nickname"
              :style="{ color: externalStore.main?.nickname_color ? externalStore.main?.nickname_color : 'currentColor' }"
          >
            {{ externalStore.main?.nickname }}
          </h4>

          <div class="user-location">
            <i :class="`flag fi fi-${externalStore.address?.country_code}`"></i>
            <span class="flag-txt">{{ `${externalStore.address?.city}, ${externalStore.address?.country}` }}</span>
          </div>

        </div>


      </div>

      <wallpaper-bottom-content-skeleton :is-external="true" v-else/>

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

      .info-block {
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
      }
    }
  }
}
</style>