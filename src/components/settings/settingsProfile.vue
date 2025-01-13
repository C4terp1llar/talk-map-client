<script setup lang="ts">

import WallpaperAvatar from "@/components/home/wallpaperAvatar.vue";
import Wallpaper from "@/components/home/wallpaper.vue";

import NicknameChange from "@/components/settings/profile/nicknameChange.vue";
import {useUserStore} from "@/stores/user";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import NicknameColorChange from "@/components/settings/profile/nicknameColorChange.vue";
import AddressStep from "@/components/registerSteps/AddressStep.vue";
import TagMake from "@/components/settings/profile/tagMake.vue";
import TagPreview from "@/components/settings/profile/tagPreview.vue";
import TagCompleteMake from "@/components/settings/profile/tagCompleteMake.vue";
import TagCompleteChange from "@/components/settings/profile/tagCompleteChange.vue";

const userStore = useUserStore()

// <emoji-picker select-mode="single" @close="console.log('close')" @select=" qwe => console.log(qwe)"/>

</script>

<template>

  <div class="wrapper-settings-tab">

    <div class="wrapper-settings-tab__profile" v-if="!userStore.pending">

      <div class="profile-preview">
        <h5 class="text-center">Предпросмотр профиля</h5>
        <v-divider/>
        <wallpaper :with-actions="true" :is-preview="true">
          <wallpaper-avatar :with-actions="true" :is-preview="true"/>
        </wallpaper>
        <v-divider/>
      </div>


      <div class="profile-nickname">
        <h5 class="text-center">Никнейм</h5>
        <v-divider/>
        <nickname-change/>
        <nickname-color-change class="mt-3"/>
        <v-divider/>
      </div>

      <div class="profile-nickname">
        <h5 class="text-center">Теги</h5>
        <v-divider/>
        <tag-complete-make/>
        <tag-complete-change/>
        <v-divider/>
      </div>

      <div class="profile-address">
        <h5 class="text-center">Адрес</h5>
        <v-divider/>
        <address-step :reg-mode="false"/>
        <v-divider/>
      </div>


    </div>

    <lazy-placeholder-loader v-else/>
  </div>
</template>

<style scoped>
.wrapper-settings-tab__profile {
  display: flex;
  flex-direction: column;
}

</style>