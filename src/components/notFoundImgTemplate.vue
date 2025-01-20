<script setup lang="ts">
interface Props {
  text: string;
  imgPath: string;
}

withDefaults(defineProps<Props>(), {
  text: "Не найдено",
  imgPath: '/stickers/msg.png',
});
</script>

<template>
  <div class="template__not-found__img">
    <v-img :src="imgPath"></v-img>
    <h6 class="ma-0">{{ text }}</h6>
  </div>
</template>

<style scoped lang="scss">
.template__not-found__img{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
</style>