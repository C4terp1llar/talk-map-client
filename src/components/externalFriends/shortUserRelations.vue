<script setup lang="ts">

import ExternalMutualFriends from "@/components/externalFriends/externalMutualFriends.vue";
import ShortFriends from "@/components/home/shortFriends.vue";
</script>

<template>
  <div class="friends-user__content">
    <short-friends mode="external" />
    <external-mutual-friends />
  </div>
</template>

<style scoped lang="scss">
.friends-user__content {
  width: 100%;
  min-width: 335px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;

  grid-column: span 3;

  @media screen and (max-width: 1370px){
    grid-column: span 10;
    flex-wrap: nowrap;
  }

  @media screen and (max-width: 800px){
    flex-wrap: wrap;
    min-width: unset;
  }
}
</style>