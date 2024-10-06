<script setup lang="ts">

import MainSettingsTabs from "@/components/settings/mainSettingsTabs.vue";

</script>

<template>
<div class="settings-wrapper">
  <main-settings-tabs/>

  <router-view/>
</div>
</template>

<style scoped>
.settings-wrapper{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 15px;
}
</style>
