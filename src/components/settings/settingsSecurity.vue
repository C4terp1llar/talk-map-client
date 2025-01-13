<script setup lang="ts">

import ChangePassword from "@/components/settings/security/changePassword.vue";
</script>

<template>
  <div class="wrapper-settings__settings-tab">
    <change-password/>
  </div>
</template>

<style scoped>
.wrapper-settings__settings-tab{
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
}
</style>