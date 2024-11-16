<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/stores/user";
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";
import {useNotificationStore} from "@/stores/notifications";
import {computed, onMounted, onUnmounted} from "vue";
import type {ShortMutualUserFriend} from "@/helpers/interfaces";
import {useFriendsStore} from "@/stores/friends";
import {useExternalUserStore} from "@/stores/externalUser";
import FriendsMutual from "@/components/friends/friendsMutual.vue";

const router = useRouter();

const userStore = useUserStore();
const friendStore = useFriendsStore();
const filterStore = useFindFriendFilterStore();
const notificationsStore = useNotificationStore();
const externalStore = useExternalUserStore()

const route = useRoute();

onUnmounted(() => {
  friendStore.unmountClear();
})

onMounted(async () => {
  if (!externalStore.existFlag || !route.params.id || typeof route.params.id !== "string") return;

  await friendStore.getMutualFriends('load', route.params.id)

  if (friendStore.mutualError) {
    notificationsStore.addNotification('error', friendStore.mutualError, 3000)
  }
})

const shortFiends = computed((): ShortMutualUserFriend[] | void => {
  if (!userStore.foundUsers) return;

  return userStore.foundUsers.map(user => {
    return {
      _id: user._id,
      nickname: user.nickname,
      nickname_color: user.nickname_color || null,
      avatar: {
        asset_url: user.avatar.asset_url
      },
    }
  })
})
</script>

<template>
  <div class="external-mutual-friends__wrapper">


  </div>
</template>

<style scoped lang="scss">
.external-mutual-friends__wrapper{

}
</style>