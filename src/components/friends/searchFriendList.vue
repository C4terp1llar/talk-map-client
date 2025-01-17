<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import SearchFriendListItem from "@/components/friends/searchFriendListItem.vue";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";
import {onBeforeUnmount, onMounted} from "vue";
import {useNotificationStore} from "@/stores/notifications";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";
import type {SearchFoundFriend} from "@/helpers/interfaces";
import NotFoundImgTemplate from "@/components/notFoundImgTemplate.vue";
import NotFoundTemplate from "@/components/notFoundTemplate.vue";
import {useRouter} from "vue-router";

interface Props {
  mode: 'friends-preload' | 'not-preload__search'
}

const props = defineProps<Props>()

const userStore = useUserStore();
const filterStore = useFindFriendFilterStore();
const notificationsStore = useNotificationStore();

const handleScroll = async () => {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const bodyHeight = document.body.offsetHeight;

  if (scrollTop + windowHeight >= bodyHeight - 100 && userStore.foundUsers && userStore.foundUsers.length === userStore.usersPerPage * userStore.currentPage && userStore.hasMoreFlag) {
    await handleUpgradeList()
  }
};

const handleUpgradeList = async () => {

  await userStore.findUsers({
    globalSearch: props.mode === 'not-preload__search' ? filterStore.globalSearch : false,
    cityFilter: filterStore.cityFilter,
    minAgeFilter: filterStore.minAgeFilter,
    maxAgeFilter: filterStore.maxAgeFilter,
    genderFilter: filterStore.genderFilter,
    nicknameFilter: filterStore.nickFilter,
    sortStr: filterStore.sortStr
  }, 'load-more')

  if (userStore.findUserError) {
    notificationsStore.addNotification('error', userStore.findUserError, 3000)
  }
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

const router = useRouter()

</script>

<template>
  <div class="search-friend-list">
    <lazy-placeholder-loader v-if="userStore.findUserPending"/>

    <div class="h-100 d-flex flex-column" v-else>
      <not-found-template v-if="!userStore.foundUsers && props.mode === 'not-preload__search'"
                          text="Найдите новых друзей" icon="mdi-account-search-outline" :icon-size="28"
                          icon-color="green" class="ma-auto align-self-center"
      />

      <div class="search-friend-list-item__wrapper">
        <div class="d-flex flex-column align-items-center ga-1" v-if="userStore.foundUsers && !userStore.foundUsers.length">
          <not-found-template :text="props.mode === 'friends-preload' ? 'Друзей пока нет' : 'Никого не нашлось'"
                              :icon="props.mode === 'friends-preload' ? 'mdi-account-cancel-outline' : 'mdi-magnify-remove-outline'"
                              :icon-size="28" icon-color="green"
          />
          <v-btn v-if="props.mode === 'friends-preload'" class="text-none" @click="router.push({name: 'friends', query:{tab: 'search'}})">Найти друзей</v-btn>
        </div>
        <search-friend-list-item v-for="user in userStore.foundUsers" :key="user._id" :user="user" v-else/>
      </div>
    </div>

    <pagination-dot-loader class="mb-2 mt-2" v-if="userStore.loadMoreUsersFlag"/>
  </div>
</template>

<style scoped lang="scss">
.search-friend-list {
  height: 100%;
}

.search-friend-list-item__wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>