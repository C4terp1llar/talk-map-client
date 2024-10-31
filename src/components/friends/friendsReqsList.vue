<script setup lang="ts">
import {useFriendsStore} from "@/stores/friends";
import {onBeforeUnmount, onMounted} from "vue";
import {useNotificationStore} from "@/stores/notifications";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import SearchFriendListItem from "@/components/friends/searchFriendListItem.vue";
import FriendsReqsItem from "@/components/friends/friendsReqsItem.vue";

interface Props {
  mode: 'incoming' | 'outgoing',
}

const props = defineProps<Props>()

const friendsStore = useFriendsStore();
const notificationsStore = useNotificationStore();

const handleScroll = async () => {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const bodyHeight = document.body.offsetHeight;

  if (scrollTop + windowHeight >= bodyHeight - 100 &&
      friendsStore.foundRequests &&
      friendsStore.foundRequests.length === friendsStore.perPage * friendsStore.currentPage &&
      friendsStore.hasMoreFlag) {
    await handleUpgradeList()
  }
};

const handleUpgradeList = async () => {
  await friendsStore.getFriendReqs(props.mode, 'load-more')

  if (friendsStore.error) {
    notificationsStore.addNotification('error', friendsStore.error, 3000)
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
  <div class="friends-reqs-list__wrapper">

    <div class="friends-reqs-list__not-found" v-if="!friendsStore.foundRequests || !friendsStore.foundRequests.length">
      <h6 v-if="props.mode === 'incoming'">тут будет картинка которая говорит о том что входящих заявок нет</h6>
      <h6 v-else>тут будет картинка которая говорит о том что исходящих заявок нет</h6>
    </div>

    <div class="friends-reqs-list-items__wrapper" v-else>
      <friends-reqs-item v-for="req in friendsStore.foundRequests" :key="req._id" :request="req" :mode="props.mode"/>
    </div>

    <pagination-dot-loader class="mb-2 mt-2" v-if="friendsStore.loadMoreFlag"/>
  </div>
</template>

<style scoped lang="scss">
.friends-reqs-list__wrapper {
  height: 100%;
  width: 100%;

  .friends-reqs-list-items__wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>