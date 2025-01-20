<script setup lang="ts">
import {useFriendsStore} from "@/stores/friends";
import {onMounted} from "vue";

const frStore = useFriendsStore();

onMounted(async () => {
  await frStore.getFriends(1, 30)
})
</script>

<template>

</template>

<style scoped lang="scss">

</style>