<script setup lang="ts">
interface Props {
  text: string;
}
const props = defineProps<Props>()
</script>

<template>
  <div class="d-flex align-items-center justify-content-center gap-2 co">
    <hr class="m-0 flex-1-0">
    <span class="text-no-wrap opacity-80 ma-0">{{props.text}}</span>
    <hr class="m-0 flex-1-0">
  </div>
</template>

<style scoped>

</style>