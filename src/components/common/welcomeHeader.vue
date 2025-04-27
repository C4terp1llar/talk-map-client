<script setup lang="ts">

</script>

<template>
  <div class="header">
    <img class="logo-lr" src="/logo/logo-lr.png">
    <img class="logo-sm" src="/logo/logo-sm.png">
  </div>
</template>

<style scoped lang="scss">
.header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 5px;
  border-radius: 15px;
  box-shadow: 0 1px 20px currentColor;
  .logo-lr, .logo-sm{
    object-fit: cover;
    filter: drop-shadow(0 0 2px currentColor);
    max-height: 28px;
  }
  .logo-lr{
    @media (max-width: 650px){
      display: none;
    }
  }
  .logo-sm {
    display: none;
    @media (max-width: 650px) {
      display: block;
    }
  }
}
</style>