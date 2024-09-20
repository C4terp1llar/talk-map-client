<template>
  <div class="loader-container" v-if="isLoading">
    <div class="dot-loader">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";

const isLoading = ref(true);
</script>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.dot-loader {
  display: flex;
  gap: 10px;
}

.dot {
  width: 15px;
  height: 15px;
  background-color: #4caf50; /* зелёный цвет для TalkMap */
  border-radius: 50%;
  animation: bounce 0.6s infinite alternate;
}

/* Задержка для каждой точки */
.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

/* Анимация прыжков */
@keyframes bounce {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-15px); /* Прыжок */
    opacity: 0.6; /* Легкая прозрачность на пике */
  }
}
</style>
