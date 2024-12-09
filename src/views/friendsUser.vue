<script setup lang="ts">
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import {useExternalUserStore} from "@/stores/externalUser";
import {onBeforeMount, onUpdated, watch} from "vue";
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

const route = useRoute()
const router = useRouter()

const externalUserStore = useExternalUserStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const friendStore = useFriendsStore();

onBeforeMount(async () => {
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
  await externalUserStore.isUserExist(userId);

  if (externalUserStore.existFlag) {
    await getExternalUserInfo(userId);
  }
}

const getExternalUserInfo = async (userId: string) => {

  await Promise.all([
    friendStore.getMutualFriends('load', userId),
    externalUserStore.getExternalMainUserInfo(userId),
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

  if (userId === userStore.mainUserInfo?._id) {
    await router.push({name: 'home'});
    return
  }

  if (friendStore.mutualError) {
    notificationStore.addNotification('error', friendStore.mutualError, 3000)
  }

  if (externalUserStore.error) {
    notificationStore.addNotification('error', externalUserStore.error, 3000)
  }

  if (userStore.findUserError) {
    notificationStore.addNotification('error', userStore.findUserError, 3000)
  }
}
</script>

<template>
  <div :key="Date.now()" class="friends-user-wrapper" v-if="externalUserStore.existFlag || externalUserStore.pending">
    <external-wallpaper >
      <external-wallpaper-avatar/>
    </external-wallpaper>

    <external-tags />

    <div class="friends-user__relations-section">
      <div class="smth">
        тут мб шорт фото, оно по высоте фит контент будет и ниже посты
      </div>
      <short-user-relations/>
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
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: auto;
    grid-auto-flow: dense;
    gap: 15px;

    .smth{
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 10px currentColor;
      border-radius: 15px;
      padding: 10px;
      background: rgb(var(--v-theme-background));
      text-align: center;

      grid-column: span 7;

      @media screen and (max-width: 1370px){
        grid-column: span 10;
      }
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