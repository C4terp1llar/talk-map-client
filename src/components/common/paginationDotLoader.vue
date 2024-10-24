<script setup lang="ts">

</script>

<template>
  <div class="loader-container">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</template>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
}

.dot {
  width: 15px;
  height: 15px;
  background-color: green;
  border-radius: 50%;
  margin: 0 5px;
  opacity: 0.5;
  animation: blink .8s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
    background-color: green;
  }
  10% {
    opacity: 1;
    transform: scale(1.2);
    background-color: #4CAF50;
  }
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}
</style>