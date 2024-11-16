<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";
import {useNotificationStore} from "@/stores/notifications";
import {computed, onMounted, onUnmounted} from "vue";
import FriendsMutualItem from "@/components/friends/friendsMutualItem.vue";
import type {ShortMutualUserFriend} from "@/helpers/interfaces";
import TextDivider from "@/components/common/textDivider.vue";
import {useRouter} from "vue-router";
import ShortHomeBlockSkeleton from "@/components/skeletons/shortHomeBlockSkeleton.vue";

const router = useRouter();

const userStore = useUserStore();
const filterStore = useFindFriendFilterStore();
const notificationsStore = useNotificationStore();

onUnmounted(() => {
  userStore.foundUsers = null;
  userStore.currentPage = 1;
  filterStore.clearAll();
})

onMounted(async () => {
  await userStore.findUsers({
    globalSearch: false,
    cityFilter: null,
    minAgeFilter: 14,
    maxAgeFilter: 100,
    genderFilter: "any",
    nicknameFilter: null
  }, 'load', 3)

  if (userStore.findUserError) {
    notificationsStore.addNotification('error', userStore.findUserError, 3000)
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
  <div class="short-friends__wrapper" v-if="!userStore.findUserPending">
    <text-divider text="Друзья"/>

    <div class="short-friends__items" v-if="shortFiends && shortFiends.length">
      <friends-mutual-item v-for="friend in shortFiends" :mutual="friend" :is-short="true"/>
    </div>
    <div class="d-flex flex-column align-items-center __no-friends" v-else>
      <h6 class="text-center">Друзей пока нет 🥺</h6>
      <v-btn class="text-none" @click="router.push({ name: 'friends', query: { tab: 'search' } })">Найти</v-btn>
    </div>


    <router-link class="load-more-btn__link m-auto" :to="{ name: 'friends', query: { tab: 'friends' } }" v-if="userStore.hasMoreFlag">
      <v-icon>mdi-dots-horizontal</v-icon>
    </router-link>
  </div>
  <short-home-block-skeleton :is-short="true" v-else/>
</template>

<style scoped lang="scss">
.__no-friends {
  padding: 10px 15px;
  gap: 5px;
}

.short-friends__wrapper {
  width: fit-content;
  box-shadow: 0 1px 10px currentColor;
  border-radius: 15px;
  padding: 10px;
  background: rgb(var(--v-theme-background));

  @media screen and (max-width: 450px) {
    width: 100%;
  }

  .short-friends__items {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>