<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";
import {onMounted, onUnmounted} from "vue";
import SearchFriendList from "@/components/friends/searchFriendList.vue";
import {useNotificationStore} from "@/stores/notifications";

const userStore = useUserStore();
const filterStore = useFindFriendFilterStore();
const notificationsStore = useNotificationStore();

onUnmounted(() => {
  userStore.foundUsers = null;
  userStore.currentPage = 1;
  filterStore.clearAll();
})

onMounted( async () => {
  await userStore.findUsers({
    globalSearch: false,
    cityFilter: null,
    minAgeFilter: 14,
    maxAgeFilter: 100,
    genderFilter: "any",
    nicknameFilter: null,
    sortStr: ''
  }, 'load')

  if (userStore.findUserError) {
    notificationsStore.addNotification('error', userStore.findUserError, 3000)
  }
})

</script>

<template>
  <div class="friends-list__wrapper">
    <search-friend-list mode="friends-preload"/>
  </div>
</template>

<style scoped>
.friends-list__wrapper{
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}
</style>