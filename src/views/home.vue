<script setup lang="ts">
import Wallpaper from "@/components/home/wallpaper.vue";
import WallpaperAvatar from "@/components/home/wallpaperAvatar.vue";
import TagsHome from "@/components/home/tagsHome.vue";
import {useWsStore} from "@/stores/wsStore";
import FriendsList from "@/components/friends/friendsList.vue";
import ShortFriends from "@/components/home/shortFriends.vue";
import ShortPhotosInternal from "@/components/photos/shortPhotosInternal.vue";
import PostEditor from "@/components/posts/postEditor.vue";
import CreatePost from "@/components/posts/createPost.vue";
import PostsList from "@/components/posts/postsList.vue";


</script>

<template>
  <div class="home-page-wrapper">
    <wallpaper :with-actions="true">
      <wallpaper-avatar :with-actions="true" :is-preview="false"/>
    </wallpaper>

    <tags-home/>
    <create-post/>

    <div class="home-page__relations">
      <short-photos-internal/>
      <div class="home-page__fr-wrapper">
        <short-friends mode="internal"/>
      </div>
    </div>

    <posts-list mode="internal"/>

  </div>
</template>

<style scoped>
.home-page-wrapper{
  display: flex;
  flex-direction: column;
  gap: 15px;
  .home-page__relations{
    width: 100%;
    display: flex;
    gap: 15px;

    @media screen and (max-width: 800px){
      flex-direction: column;
    }

    .home-page__fr-wrapper{
      width: fit-content;
      @media screen and (max-width: 800px){
        width: 100%;
      }
    }
  }
}
</style>