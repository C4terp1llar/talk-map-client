<script setup lang="ts">

import CmCreateGroupWrap from "@/components/communications/cmCreateGroupWrap.vue";
</script>

<template>
  <div class="cm-sidebar-head__wrapper">
    <cm-create-group-wrap/>
  </div>
</template>

<style scoped lang="scss">
.cm-sidebar-head__wrapper{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>