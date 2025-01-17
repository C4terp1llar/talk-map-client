<script setup lang="ts">
import {useFriendsStore} from "@/stores/friends";
import {onBeforeUnmount, onMounted} from "vue";
import {useNotificationStore} from "@/stores/notifications";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import SearchFriendListItem from "@/components/friends/searchFriendListItem.vue";
import FriendsReqsItem from "@/components/friends/friendsReqsItem.vue";
import NotFoundTemplate from "@/components/notFoundTemplate.vue";
import {useRouter} from "vue-router";

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

const router = useRouter()
</script>

<template>
  <div class="friends-reqs-list__wrapper">

    <div class="friends-reqs-list__not-found" v-if="!friendsStore.foundRequests || !friendsStore.foundRequests.length">
      <not-found-template :text="props.mode === 'incoming' ? 'Входящих заявок пока нет' : 'Исходящих заявок пока нет'"
                          :icon="props.mode === 'incoming' ? 'mdi-inbox-arrow-down-outline' : 'mdi-inbox-arrow-up-outline'"
                          :icon-size="28" icon-color="green"
      />
      <v-btn class="text-none" @click="router.push({name: 'friends', query:{tab: 'search'}})">Найти друзей</v-btn>
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
.friends-reqs-list__not-found{
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
</style>