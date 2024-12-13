<script setup lang="ts">

</script>

<template>
  <div class="photos-list__not-found">
    <v-icon :size="60" color="green">mdi-image-remove-outline</v-icon>
    <h6>Фотографий пока нет</h6>
  </div>
</template>

<style scoped lang="scss">
.photos-list__not-found{
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
}
</style>