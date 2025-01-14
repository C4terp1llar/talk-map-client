<script setup lang="ts">
import ChangePasswordWrap from "@/components/settings/security/changePasswordWrap.vue";
import SessionList from "@/components/settings/security/sessionList.vue";
</script>

<template>
  <div class="wrapper-settings__settings-tab">
    <session-list/>
    <change-password-wrap/>
  </div>
</template>

<style scoped>
.wrapper-settings__settings-tab{
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>