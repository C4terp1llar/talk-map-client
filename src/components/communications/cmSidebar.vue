<script setup lang="ts">

import CmSidebarTabs from "@/components/communications/cmSidebarTabs.vue";
import CmSidebarList from "@/components/communications/cmSidebarList.vue";
import CmSidebarListSearch from "@/components/communications/cmSidebarListSearch.vue";
</script>

<template>
  <div class="cm-sidebar__wrapper">
<!--    мб контролы по типу создания группы или карандаша чтобы выбрать кому написать -->
    <v-divider/>
    <cm-sidebar-list/>
  </div>
</template>

<style scoped lang="scss">
.cm-sidebar__wrapper {
  height: 100%;
  grid-column: span 1;
  box-shadow: 0 1px 10px currentColor;
  border-radius: 15px;
  background: rgb(var(--v-theme-background));

  display: flex;
  flex-direction: column;
}
</style>