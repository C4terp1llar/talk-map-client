<script setup lang="ts">
import SearchFriendGlobal from "@/components/friends/searchFriendGlobal.vue";
import {useUserStore} from "@/stores/user";
import {computed} from "vue";
import SearchFriendSort from "@/components/friends/searchFriendSort.vue";

const userStore = useUserStore();

const disableProp = computed(() => userStore.loadMoreUsersFlag || userStore.findUserPending)
</script>

<template>
  <div class="search-friend-sub-bar__wrapper">
    <search-friend-sort :disabled="disableProp"/>
    <search-friend-global :disabled="disableProp"/>
  </div>
</template>

<style scoped lang="scss">
.search-friend-sub-bar__wrapper{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>