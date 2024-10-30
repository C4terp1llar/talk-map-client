<script setup lang="ts">
const props = defineProps({
  brightness: {
    type: Number,
    default: 1
  }
});
</script>

<template>
  <v-skeleton-loader
      class="loader-sk-abs"
      :style="{ filter: `brightness(${props.brightness})` }"
  />
</template>

<style scoped>
.loader-sk-abs {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
