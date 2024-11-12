<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import SearchFriendListItem from "@/components/friends/searchFriendListItem.vue";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";
import {onBeforeUnmount, onMounted} from "vue";
import {useNotificationStore} from "@/stores/notifications";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";
import type { SearchFoundFriend} from "@/helpers/interfaces";

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
    nicknameFilter: filterStore.nickFilter
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

</script>

<template>
  <div class="search-friend-list">
    <lazy-placeholder-loader v-if="userStore.findUserPending"/>

    <div v-else>
      <h6 v-if="!userStore.foundUsers && props.mode === 'not-preload__search'">тут будет картинка которая предлагает начать поиск людей</h6>

      <div class="search-friend-list-item__wrapper">
        <h6 v-if="userStore.foundUsers && !userStore.foundUsers.length">
          {{ props.mode === 'friends-preload' ? 'картинка что друзей пока нет' : 'тут будет картинка не найдено' }}
        </h6>
        <search-friend-list-item v-for="user in userStore.foundUsers" :key="user._id" :user="user" v-else/>
      </div>
    </div>

    <pagination-dot-loader class="mb-2 mt-2" v-if="userStore.loadMoreUsersFlag"/>
  </div>
</template>

<style scoped lang="scss">
.search-friend-list{
  height: 100%;
}
.search-friend-list-item__wrapper{
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>