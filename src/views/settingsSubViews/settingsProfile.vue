<script setup lang="ts">

import WallpaperAvatar from "@/components/home/wallpaperAvatar.vue";
import Wallpaper from "@/components/home/wallpaper.vue";

import NicknameChange from "@/components/settings/profile/nicknameChange.vue";
import {useUserStore} from "@/stores/user";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import NicknameColorChange from "@/components/settings/profile/nicknameColorChange.vue";
import AddressStep from "@/components/registerSteps/AddressStep.vue";

const userStore = useUserStore()
</script>

<template>
  <div class="wrapper-settings-tab">

    <div class="wrapper-settings-tab__profile" v-if="!userStore.pending">

      <div class="profile-preview">
        <h4 class="text-center">Предпросмотр профиля</h4>
        <v-divider/>
        <wallpaper :with-actions="false" :is-preview="true">
          <wallpaper-avatar :with-actions="false" />
        </wallpaper>
        <v-divider/>
      </div>

      <div class="profile-nickname">
        <h4 class="text-center">Никнейм</h4>
        <v-divider/>
        <nickname-change/>
        <nickname-color-change class="mt-3"/>
        <v-divider/>
      </div>

      <div class="profile-address">
        <h4 class="text-center">Адрес</h4>
        <v-divider/>
        <address-step :reg-mode="false"/>
        <v-divider/>
      </div>


    </div>

    <lazy-placeholder-loader v-else/>
  </div>
</template>

<style scoped>
.wrapper-settings-tab__profile{
  display: flex;
  flex-direction: column;
}

</style>