<script setup lang="ts">

import CmSidebarListSearch from "@/components/communications/cmSidebarListSearch.vue";
</script>

<template>
  <div class="cm-sidebar-list__wrapper">
    <cm-sidebar-list-search/>
    <v-divider/>
  </div>
</template>

<style scoped lang="scss">
.cm-sidebar-list__wrapper{
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px;
}
</style>