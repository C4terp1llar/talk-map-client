<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";

const userStore = useUserStore()

</script>

<template>
  <v-avatar class="wallpaper-avatar">
    <v-img
        :src="userStore.mainUserInfo?.avatar" alt="avatar"
        v-if="!userStore.pending"
        cover
    >
      <template v-slot:placeholder>
        <lazy-placeholder-loader/>
      </template>
    </v-img>
    <skeleton-loader v-else/>
  </v-avatar>
</template>

<style scoped lang="scss">
.wallpaper-avatar {
  background: rgb(var(--v-theme-background));
  border: 4px solid rgb(var(--v-theme-background));
  margin: 15px;
  align-self: flex-end;
  z-index: 9;
  position: relative;
  min-width: 150px;
  min-height: 150px;
  @media screen and (max-width: 850px) {
    min-width: 100px;
    min-height: 100px;
    margin: 0 0 60px 0;
  }
}

</style>