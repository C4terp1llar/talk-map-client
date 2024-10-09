<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import ChangeAvatarMenu from "@/components/home/changeAvatarMenu.vue";

const userStore = useUserStore()

interface Props {
  withActions: boolean,
  isPreview: boolean,
}
const props = defineProps<Props>()
</script>

<template>
  <div class="wallpaper-avatar-wrapper">
    <v-avatar class="wallpaper-avatar">
      <skeleton-loader v-if="userStore.pending || userStore.avatarPending"/>
      <v-img
          class="avatar-img"
          :src="userStore.userAvatar || userStore.mainUserInfo?.avatar" alt="avatar"
          v-else
          cover
      >
        <template v-slot:placeholder>
          <skeleton-loader/>
        </template>
      </v-img>
    </v-avatar>

    <change-avatar-menu v-if="props.withActions" :is-preview="props.isPreview"/>
  </div>
</template>

<style scoped lang="scss">
.wallpaper-avatar-wrapper{
  width: fit-content;
  height: fit-content;
  align-self: flex-end;
  z-index: 9;
  position: relative;
  .wallpaper-avatar {
    background: rgb(var(--v-theme-background));
    border: 4px solid rgb(var(--v-theme-background));

    min-width: 150px;
    min-height: 150px;

    @media screen and (max-width: 850px) {
      min-width: 100px;
      min-height: 100px;
    }
  }
}
</style>