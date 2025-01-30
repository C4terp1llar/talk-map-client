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
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: minmax(200px, 300px) 1fr;
  grid-template-rows: 1fr;
}
</style>