<script setup lang="ts">
import {type Component, computed} from 'vue';
import { useRoute } from "vue-router";
import MainFriendsTabs from "@/components/friends/mainFriendsTabs.vue";
import FriendsList from "@/components/friends/friendsList.vue";
import SearchFriend from "@/components/friends/searchFriend.vue";
import IncomingReqs from "@/components/friends/incomingReqs.vue";
import OutgoingReqs from "@/components/friends/outgoingReqs.vue";

type Tab = 'friends' | 'search' | 'incoming' | 'outgoing';

const route = useRoute();

const activeTab = computed<Tab>(() => {
  return route.query.tab as Tab || 'friends';
});


const componentsMap: Record<Tab, Component> = {
  friends: FriendsList,
  incoming: IncomingReqs,
  outgoing: OutgoingReqs,
  search: SearchFriend
};

</script>

<template>
  <div class="friends-page__wrapper">
    <main-friends-tabs />


    <component :is="componentsMap[activeTab]" />
  </div>
</template>

<style scoped>
.friends-page__wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
}
</style>
