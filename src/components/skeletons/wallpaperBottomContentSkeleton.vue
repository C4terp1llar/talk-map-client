<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";
</script>

<template>
  <div class="bottom-wallpaper-block-content">
    <div class="info-block w-100">
      <h4
          class="user-nickname w-100 position-relative"
      >
        Никнейм
        <skeleton-loader/>
      </h4>

      <div class="user-location position-relative">
        <span>Город, страна</span>
        <skeleton-loader/>
      </div>
    </div>

    <div class="actions-block ml-2">
      <v-btn
          variant="tonal"
          class="text-none"
          prepend-icon="mdi-palette-outline"
      >
        Настроить
        <skeleton-loader/>
      </v-btn>
    </div>
  </div>
</template>

<style scoped>

</style>