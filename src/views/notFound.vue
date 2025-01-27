<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter();
</script>

<template>
  <div class="not-found-page__wrapper">
    <h2 class="text-center">Кажется вы заблудились 🤔</h2>
    <v-btn variant="outlined" class="text-none" @click="router.back()">Назад</v-btn>
  </div>
</template>

<style scoped>
.not-found-page__wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
