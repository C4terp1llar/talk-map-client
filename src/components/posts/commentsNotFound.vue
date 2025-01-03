<script setup lang="ts">

</script>

<template>
  <div class="comments__not-found mb-1 mt-1">
    <v-icon class="__not_found-icon" :size="30" color="green">mdi-comment-remove-outline</v-icon>
    <h6>Коммментариев пока нет</h6>
  </div>
</template>

<style scoped lang="scss">
.comments__not-found{
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;

}
</style>