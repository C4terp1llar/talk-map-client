<script setup lang="ts">
interface Props {
  size: number;
}
const props = defineProps<Props>()
</script>

<template>
  <v-progress-circular
      :size="props.size"
      indeterminate
      color="green"
  ></v-progress-circular>
</template>

<style scoped>

</style>