<template>
  <div class="loader-container">
    <div class="dot-loader">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.dot-loader {
  display: flex;
  gap: 10px;
}

.dot {
  width: 15px;
  height: 15px;
  background-color: #4caf50;
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


@keyframes bounce {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-15px);
    opacity: 0.6;
  }
}
</style>
