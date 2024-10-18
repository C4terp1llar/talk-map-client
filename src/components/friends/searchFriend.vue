<script setup lang="ts">

import SearchFriendBar from "@/components/friends/searchFriendBar.vue";
import SearchFriendFilterChips from "@/components/friends/searchFriendFilterChips.vue";
</script>

<template>
  <div class="search-friend-wrapper">
    <search-friend-filter-chips/>
    <search-friend-bar/>
  </div>
</template>

<style scoped>
.search-friend-wrapper{
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>