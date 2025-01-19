<script setup lang="ts">
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import {useExternalUserStore} from "@/stores/externalUser";
import {onBeforeMount, onMounted, onUnmounted, onUpdated, watch} from "vue";
import {useNotificationStore} from "@/stores/notifications";
import ExternalWallpaper from "@/components/externalFriends/externalWallpaper.vue";
import ExternalWallpaperAvatar from "@/components/externalFriends/externalWallpaperAvatar.vue";
import ExternalTags from "@/components/externalFriends/externalTags.vue";
import SearchFriendNotFound from "@/components/friends/searchFriendNotFound.vue";
import {useUserStore} from "@/stores/user";
import ExternalMutualFriends from "@/components/externalFriends/externalMutualFriends.vue";
import {useFriendsStore} from "@/stores/friends";
import ShortFriends from "@/components/home/shortFriends.vue";
import ShortUserRelations from "@/components/externalFriends/shortUserRelations.vue";
import {usePhotoStore} from "@/stores/photo";
import ShortPhotosExternal from "@/components/photos/shortPhotosExternal.vue";
import PostsList from "@/components/posts/postsList.vue";

const route = useRoute()
const router = useRouter()

const externalUserStore = useExternalUserStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const friendStore = useFriendsStore();
const phStore = usePhotoStore();

onUnmounted(() => phStore.photos = null)

onMounted(async () => {
  await beforeLoad()
})

watch(
    () => route.params.id,
    async (newId) => {
      if (newId) {
        await beforeLoad()
      }
    }
);

const beforeLoad = async () => {
  const userId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

  const match = await externalUserStore.isUserExist(userId);

  if (match) {
    await router.push({name: 'home'});
    return
  }

  if (externalUserStore.existFlag) {
    await getExternalUserInfo(userId);
  }
}

const getExternalUserInfo = async (userId: string) => {

  await Promise.all([
    externalUserStore.getExternalMainUserInfo(userId),
    phStore.getPhotos('load', 5, userId),
    friendStore.getMutualFriends('load', userId),
    userStore.findUsers({
      globalSearch: false,
      cityFilter: null,
      minAgeFilter: 14,
      maxAgeFilter: 100,
      genderFilter: "any",
      nicknameFilter: null,
      sortStr: ''
    }, 'load', 3, userId)
  ])

  if (friendStore.mutualError) {
    notificationStore.addNotification('error', friendStore.mutualError, 3000)
  }

  if (externalUserStore.error) {
    notificationStore.addNotification('error', externalUserStore.error, 3000)
  }

  if (userStore.findUserError) {
    notificationStore.addNotification('error', userStore.findUserError, 3000)
  }

  if (phStore.phError) {
    notificationStore.addNotification('error', phStore.phError, 3000)
  }
}
</script>

<template>
  <div class="friends-user-wrapper" v-if="externalUserStore.existFlag || externalUserStore.pending">
    <external-wallpaper >
      <external-wallpaper-avatar/>
    </external-wallpaper>

    <external-tags />

    <div class="friends-user__relations-section">
      <div class="photos">
        <short-photos-external :mode="'external'" :short="true"/>
      </div>
      <short-user-relations/>
      <div class="posts">
        <posts-list v-if="externalUserStore.existFlag" mode="external" :uid="Array.isArray(route.params.id) ? route.params.id[0] : route.params.id"/>
      </div>
    </div>

  </div>

  <div class="friends-user-not-found" v-if="!externalUserStore.existFlag && !externalUserStore.pending">
    <search-friend-not-found/>
  </div>
</template>

<style scoped lang="scss">
.friends-user-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .friends-user__relations-section{
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    grid-auto-flow: dense;
    gap: 15px;

    @media screen and (max-width: 900px){
      grid-template-columns: 1fr;
    }

    .photos{
      box-shadow: 0 1px 10px currentColor;
      border-radius: 15px;
      padding: 10px;
      background: rgb(var(--v-theme-background));
      text-align: center;
      width: 100%;
      height: fit-content;
    }

    .posts{
      grid-column: span 1;
      grid-row: span 1;
    }

  }
}

.friends-user-not-found {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>