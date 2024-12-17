<script setup lang="ts">

import AvatarMenu from "@/components/avatarMenu.vue";
</script>

<template>
<div class="header">
  <div class="header__logo">
    <img class="logo-lr" src="/logo/logo-lr.png">
    <img class="logo-sm" src="/logo/logo-sm.png">
    <router-link class="header__logo-link" :to="{name: 'home'}"/>
  </div>
  <avatar-menu/>
</div>
</template>

<style scoped lang="scss">
.header {
  background: rgb(var(--v-theme-background));
  padding: 10px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin: 5px;
  border-radius: 15px;
  box-shadow: 0 1px 10px currentColor;
  backdrop-filter: blur(10px);

  .header__logo{
    position: relative;
    display: flex;
    align-items: center;
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
    .logo-sm{
      display: none;
      @media (max-width: 650px){
        display: block;
      }
    }
    .header__logo-link{
      position: absolute;
      inset: 0;
    }
  }
}
</style>