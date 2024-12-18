<script setup lang="ts">
import Wallpaper from "@/components/home/wallpaper.vue";
import WallpaperAvatar from "@/components/home/wallpaperAvatar.vue";
import TagsHome from "@/components/home/tagsHome.vue";
import {useWsStore} from "@/stores/wsStore";
import FriendsList from "@/components/friends/friendsList.vue";
import ShortFriends from "@/components/home/shortFriends.vue";
import ShortPhotosInternal from "@/components/photos/shortPhotosInternal.vue";


</script>

<template>
  <div class="home-page-wrapper">
    <wallpaper :with-actions="true">
      <wallpaper-avatar :with-actions="true" :is-preview="false"/>
    </wallpaper>

    <tags-home/>

    <div class="home-page__relations">
      <short-photos-internal/>
      <div class="home-page__friends-wrapper">
        <short-friends mode="internal"/>
      </div>
    </div>

  </div>

</template>

<style scoped>
.home-page-wrapper{
  display: flex;
  flex-direction: column;
  gap: 15px;
  .home-page__relations{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: auto;
    grid-auto-flow: dense;
    gap: 15px;

    .home-page__friends-wrapper{
      width: 100%;
      min-width: 335px;
      display: flex;
      flex-wrap: wrap;
      gap: 15px;

      grid-column: span 3;

      @media screen and (max-width: 1000px){
        grid-column: span 10;
        flex-wrap: nowrap;
      }

      @media screen and (max-width: 800px){
        flex-wrap: wrap;
        min-width: unset;
      }
    }
  }
}
</style>