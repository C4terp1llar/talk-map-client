<script setup lang="ts">

import CmSidebarTabs from "@/components/communications/cmSidebarTabs.vue";
import CmSidebarList from "@/components/communications/cmSidebarList.vue";
import CmSidebarListSearch from "@/components/communications/cmSidebarListSearch.vue";
import CmCreateGroupWrap from "@/components/communications/cmCreateGroupWrap.vue";
import CmSidebarHead from "@/components/communications/cmSidebarHead.vue";

</script>

<template>
  <div class="cm-sidebar__wrapper">
    <cm-sidebar-head/>
    <cm-sidebar-list/>
  </div>
</template>

<style scoped lang="scss">
.cm-sidebar__wrapper {
  height: 100%;
  grid-column: span 1;
  border: 1px solid gray;
  border-radius: 15px;
  background: rgb(var(--v-theme-background));

  display: flex;
  flex-direction: column;
}
</style>