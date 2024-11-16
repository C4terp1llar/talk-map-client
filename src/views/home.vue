<script setup lang="ts">
import Wallpaper from "@/components/home/wallpaper.vue";
import WallpaperAvatar from "@/components/home/wallpaperAvatar.vue";
import TagsHome from "@/components/home/tagsHome.vue";
import {useWsStore} from "@/stores/wsStore";
import FriendsList from "@/components/friends/friendsList.vue";
import ShortFriends from "@/components/home/shortFriends.vue";


</script>

<template>
  <div class="home-page-wrapper">
    <wallpaper :with-actions="true">
      <wallpaper-avatar :with-actions="true" :is-preview="false"/>
    </wallpaper>

    <tags-home/>

    <short-friends/>

  </div>

</template>

<style scoped>
.home-page-wrapper{
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>