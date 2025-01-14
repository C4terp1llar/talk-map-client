<script setup lang="ts">

import SwitcherNotifications from "@/components/settings/ntf/switcherNotifications.vue";
</script>

<template>
  <div class="wrapper-settings__settings-tab">
    <switcher-notifications/>
  </div>
</template>

<style scoped>
.wrapper-settings__settings-tab{
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>