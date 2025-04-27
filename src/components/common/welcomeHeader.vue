<script setup lang="ts">

</script>

<template>
  <div class="header">
    <img class="logo-lr" alt="logo" src="/logo/logo-f.png">
  </div>
</template>

<style scoped lang="scss">
.header {
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 5px;
  border-radius: 15px;
  box-shadow: 0 1px 20px currentColor;
  .logo-lr{
    object-fit: cover;
    max-height: 50px;
  }
}
</style>