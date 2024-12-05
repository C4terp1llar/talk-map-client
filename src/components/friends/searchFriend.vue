<script setup lang="ts">

import SearchFriendBar from "@/components/friends/searchFriendBar.vue";
import {vAutoAnimate} from '@formkit/auto-animate/vue'
import SearchFriendList from "@/components/friends/searchFriendList.vue";
import {useUserStore} from "@/stores/user";
import {onMounted, onUnmounted} from "vue";
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";
import SearchFriendSubBar from "@/components/friends/searchFriendSubBar.vue";

const userStore = useUserStore();
const filterStore = useFindFriendFilterStore();

onUnmounted(() => {
  userStore.foundUsers = null;
  userStore.currentPage = 1;
  filterStore.clearAll();
})


</script>

<template>
  <div class="search-friend-wrapper" v-auto-animate>
    <search-friend-bar/>
    <v-divider class="ma-0"/>
    <search-friend-sub-bar/>

    <search-friend-list mode="not-preload__search"/>
  </div>
</template>

<style scoped>
.search-friend-wrapper{
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}
</style>