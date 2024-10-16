<script setup lang="ts">

import ScrollableContainer from "@/components/common/scrollableContainer.vue";
import TagList from "@/components/settings/profile/tagList.vue";
</script>

<template>
  <div class="tags-home-wrapper">
    <scrollable-container>
      <tag-list :is-preview="false" />
    </scrollable-container>
  </div>
</template>

<style scoped lang="scss">
.tags-home-wrapper{
  padding: 10px;
  background: rgb(var(--v-theme-background));
  box-shadow: 0 0 10px currentColor;
  border-radius: 15px;
}
</style>