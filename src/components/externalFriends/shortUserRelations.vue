<script setup lang="ts">

import ExternalMutualFriends from "@/components/externalFriends/externalMutualFriends.vue";
import ShortFriends from "@/components/home/shortFriends.vue";
</script>

<template>
  <div class="friends-user__content">
    <short-friends mode="external" />
    <external-mutual-friends :without-preload="true"/>
  </div>
</template>

<style scoped lang="scss">
.friends-user__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: fit-content;
  gap: 15px;

  @media screen and (max-width: 800px){
    width: 100%;
  }
}
</style>