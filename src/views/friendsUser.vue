<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {useExternalUserStore} from "@/stores/externalUser";
import {onBeforeMount, onMounted} from "vue";
import {useNotificationStore} from "@/stores/notifications";
import ExternalWallpaper from "@/components/externalFriends/externalWallpaper.vue";
import ExternalWallpaperAvatar from "@/components/externalFriends/externalWallpaperAvatar.vue";
import ExternalTags from "@/components/externalFriends/externalTags.vue";
import SearchFriendNotFound from "@/components/friends/searchFriendNotFound.vue";
import {useUserStore} from "@/stores/user";

const route = useRoute()
const router = useRouter()

const externalUserStore = useExternalUserStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

onMounted(async () => {
  const userId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  await externalUserStore.isUserExist(userId);

  if (externalUserStore.existFlag){
    await getExternalUserInfo(userId);
  }
})

const getExternalUserInfo = async (userId: string) => {
  await externalUserStore.getExternalMainUserInfo(userId);

  if (externalUserStore.main && externalUserStore.main.nickname === userStore.mainUserInfo?.nickname){
    await router.push({ name: 'home'});
    return
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
  </div>
  <div class="friends-user-not-found " v-if="!externalUserStore.existFlag && !externalUserStore.pending">
    <search-friend-not-found/>
  </div>
</template>

<style scoped lang="scss">
.friends-user-wrapper{
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.friends-user-not-found{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>