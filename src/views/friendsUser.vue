<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {useExternalUserStore} from "@/stores/externalUser";
import {onBeforeMount} from "vue";
import {useNotificationStore} from "@/stores/notifications";
import ExternalWallpaper from "@/components/externalFriends/externalWallpaper.vue";
import ExternalWallpaperAvatar from "@/components/externalFriends/externalWallpaperAvatar.vue";
import ExternalTags from "@/components/externalFriends/externalTags.vue";
import SearchFriendNotFound from "@/components/friends/searchFriendNotFound.vue";
import {useUserStore} from "@/stores/user";
import ExternalMutualFriends from "@/components/externalFriends/externalMutualFriends.vue";
import {useFriendsStore} from "@/stores/friends";

const route = useRoute()
const router = useRouter()

const externalUserStore = useExternalUserStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const friendStore = useFriendsStore();

onBeforeMount(async () => {
  const userId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  await externalUserStore.isUserExist(userId);

  if (externalUserStore.existFlag) {
    await getExternalUserInfo(userId);
  }
})

const getExternalUserInfo = async (userId: string) => {

  await Promise.all([
    friendStore.getMutualFriends('load', userId),
    externalUserStore.getExternalMainUserInfo(userId)
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
}
</script>

<template>
  <div class="friends-user-wrapper" v-if="externalUserStore.existFlag || externalUserStore.pending">
    <external-wallpaper>
      <external-wallpaper-avatar/>
    </external-wallpaper>

    <external-tags/>

    <external-mutual-friends/>
  </div>
  <div class="friends-user-not-found " v-if="!externalUserStore.existFlag && !externalUserStore.pending">
    <search-friend-not-found/>
  </div>
</template>

<style scoped lang="scss">
.friends-user-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.friends-user-not-found {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>