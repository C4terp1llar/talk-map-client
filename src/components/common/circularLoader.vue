<script setup lang="ts">
interface Props {
  size: number;
  color?: string
}
const props = defineProps<Props>()
</script>

<template>
  <v-progress-circular
      :size="props.size"
      indeterminate
      :color="color ? color : 'green'"
  ></v-progress-circular>
</template>

<style scoped>

</style>