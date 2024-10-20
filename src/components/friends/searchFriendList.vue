<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import SearchFriendListItem from "@/components/friends/searchFriendListItem.vue";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";

const userStore = useUserStore();
</script>

<template>
  <div class="search-friend-list">
    <lazy-placeholder-loader v-if="userStore.findUserPending"/>

    <div v-else>
      <h6 v-if="!userStore.foundUsers">тут будет картинка которая предлагает начать поиск людей</h6>

      <div class="search-friend-list-item__wrapper">
        <h6 v-if="userStore.foundUsers && !userStore.foundUsers.length">тут будет картинка 'не найдено'</h6>
        <search-friend-list-item v-for="user in userStore.foundUsers" :key="user._id" :user="user" v-else/>
      </div>
    </div>
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