<script setup lang="ts">

import AvatarMenu from "@/components/avatarMenu.vue";
</script>

<template>
<div class="header">
  <v-icon size="large" color="green-darken-2">
    mdi-map-marker-radius-outline
  </v-icon>
  <avatar-menu/>
</div>
</template>

<style scoped lang="scss">
.header {
  background: rgb(var(--v-theme-background));
  padding: 10px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin: 5px;
  border-radius: 15px;
  box-shadow: 0 1px 10px currentColor;
}
</style>