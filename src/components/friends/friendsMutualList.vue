<script setup lang="ts">
import {useFriendsStore} from "@/stores/friends";
import {useNotificationStore} from "@/stores/notifications";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";
import FriendsMutualItem from "@/components/friends/friendsMutualItem.vue";
import MutalItemSkeleton from "@/components/skeletons/mutalItemSkeleton.vue";
import {useUserStore} from "@/stores/user";
import type {ShortMutualUserFriend} from "@/helpers/interfaces";

interface Props {
  id: string,
  mode: 'friends' | 'mutual'
}

const props = defineProps<Props>();

const friendsStore = useFriendsStore();
const userStore = useUserStore();
const notificationsStore = useNotificationStore();

const loadMoreFlag = computed(() => {

  if (props.mode === 'friends') {
    return (
        userStore.foundUsers &&
        userStore.foundUsers.length === userStore.usersPerPage * userStore.currentPage &&
        userStore.hasMoreFlag
    )
  } else {
    return (
        friendsStore.foundMutual &&
        friendsStore.foundMutual.length === friendsStore.perPage * friendsStore.currentPageMutual &&
        friendsStore.hasMoreMutual
    )
  }
})

const handleUpgradeList = async () => {
  if (!loadMoreFlag.value) return;

  localMorePending.value = true
  if (props.mode === 'friends'){
    await userStore.findUsers({
      globalSearch: false,
      cityFilter: null,
      minAgeFilter: 14,
      maxAgeFilter: 100,
      genderFilter: "any",
      nicknameFilter: null
    }, 'load-more', undefined, props.id)
  }else{
    await friendsStore.getMutualFriends('load-more', props.id)
  }
  localMorePending.value = false

  if (friendsStore.mutualError) {
    notificationsStore.addNotification('error', friendsStore.mutualError, 3000)
  }

  if (userStore.findUserError) {
    notificationsStore.addNotification('error', userStore.findUserError, 3000)
  }
}

const mutualFriendsRef = ref<HTMLElement | null>(null);

const localMorePending = ref<boolean>(false)

const shortFiends = computed((): ShortMutualUserFriend[] | void => {
  if (!userStore.foundUsers || props.mode !== 'friends') return;

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
  <div class="mutual-friends-popup__content-list" ref="mutualFriendsRef">

    <h5 class="text-center align-self-center">{{props.mode === 'mutual' ? 'Общие друзья' : 'Друзья'}}</h5>

    <div class="mutual-friends-popup__content-list__items">
      <mutal-item-skeleton v-for="i in 5" :key="i" v-if="props.mode === 'mutual' ? friendsStore.mutualPending : userStore.findUserPending"/>
      <friends-mutual-item v-for="mutual in props.mode === 'friends' ? shortFiends : friendsStore.foundMutual" :mutual="mutual" v-else/>

      <h4
          class="text-center"
          v-if="friendsStore.foundMutual && !friendsStore.foundMutual.length"
      >Общих друзей нет :(</h4>
    </div>

    <v-btn
        color="green"
        class="text-none w-100"
        variant="text"
        @click="handleUpgradeList"
        v-if="loadMoreFlag && !localMorePending"
    >
      Еще
    </v-btn>

    <pagination-dot-loader v-if="localMorePending"/>
  </div>
</template>

<style scoped lang="scss">
.mutual-friends-popup__content-list {
  position: relative;

  @media screen and (max-width: 650px) {
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .mutual-friends-popup__content-list__items {
      margin: auto auto;
    }
  }

  .mutual-friends-popup__content-list__items {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>