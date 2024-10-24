<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter();
</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <h6>Пользователь не найден</h6>
    <v-btn class="text-none" @click="router.push({name: 'home'})">Домой</v-btn>
  </div>
</template>

<style scoped>

</style>