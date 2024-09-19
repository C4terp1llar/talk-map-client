<script setup lang="ts">

import MainAside from "@/components/common/mainAside.vue";
</script>

<template>
<div class="wrapper">
  <aside>
    <main-aside/>
  </aside>
  <main class="main">
    <router-view/>
  </main>
</div>
</template>

<style scoped>
.wrapper {
  padding: 0 10%;
  width: 100%;
  height: 100% ;
  display: grid;
  grid-template-columns: auto 7fr;
  grid-template-rows: 1fr;
  gap: 15px;
  position: relative;

  @media (max-width: 900px) {
    padding: 0 5%;
  }

  @media (max-width: 768px) {
    padding: 0;
  }

  @media (max-width: 650px) {
    gap: 0;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
}
.main{
  border-radius: 15px;
  padding: 15px;
  margin: 5px;
  box-shadow: 0 1px 20px currentColor;

  @media (max-width: 650px) {
    grid-row: 1;
    padding-bottom: 90px;
  }
}
</style>