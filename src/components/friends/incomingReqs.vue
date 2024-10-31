<script setup lang="ts">
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import {useFriendsStore} from "@/stores/friends";
import {useNotificationStore} from "@/stores/notifications";
import {onMounted, onUnmounted} from "vue";
import FriendsReqsList from "@/components/friends/friendsReqsList.vue";

const friendsStore = useFriendsStore();
const notificationsStore = useNotificationStore();

onMounted(async () => {
  friendsStore.viewMode = 'incoming';

  await friendsStore.getFriendReqs('incoming', 'load')

  if (friendsStore.error){
    notificationsStore.addNotification('error', friendsStore.error, 3000);
  }
})

onUnmounted(() => friendsStore.unmountClear())
</script>

<template>
  <div class="incoming-reqs__wrapper">
    <friends-reqs-list v-if="!friendsStore.pending" mode="incoming"/>
    <lazy-placeholder-loader v-else/>
  </div>
</template>

<style scoped lang="scss">
.incoming-reqs__wrapper{
  height: 100%;
  width: 100%;
}
</style>