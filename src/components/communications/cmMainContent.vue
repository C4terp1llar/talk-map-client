<script setup lang="ts">

import CreateMessage from "@/components/communications/createMessage.vue";
</script>

<template>
  <div class="cm-main-content__wrapper">
    <create-message/>
  </div>
</template>

<style scoped lang="scss">
.cm-main-content__wrapper {
  grid-column: span 1;
  box-shadow: 0 1px 10px currentColor;
  border-radius: 15px;
  background: rgb(var(--v-theme-background));
}
</style>