<script setup lang="ts">

import CmSidebar from "@/components/communications/cmSidebar.vue";
import CmMainContent from "@/components/communications/cmMainContent.vue";
</script>

<template>
  <div class="communications__wrapper">
    <cm-sidebar/>
    <cm-main-content/>
  </div>
</template>

<style scoped lang="scss">
.communications__wrapper{
  width: 100%;
  height: calc(100vh - 110px);
  display: grid;
  gap: 10px;
  grid-template-columns: minmax(200px, 300px) 1fr;
  grid-template-rows: 1fr;

  @media (max-width: 650px) {
    height: calc(100vh - 170px);
  }
}
</style>