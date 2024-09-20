<script setup lang="ts">

import WelcomeHeader from "@/components/common/welcomeHeader.vue";
import WelcomeFooter from "@/components/common/welcomeFooter.vue";
import ThemeSwitcher from "@/components/themeSwitcher.vue";
</script>

<template>
  <div class="wrapper">
    <header>
      <welcome-header/>
    </header>
    <main class="d-flex w-100 align-items-center flex-wrap justify-content-center">
      <router-view/>
    </main>
    <theme-switcher class="justify-content-center"/>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100% ;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
}
</style>