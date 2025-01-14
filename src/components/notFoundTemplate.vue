<script setup lang="ts">
interface Props {
  text: string;
  icon: string;
  iconColor?: string;
  iconSize?: number;
}

withDefaults(defineProps<Props>(), {
  text: "Не найдено",
  icon: 'mdi-cancel',
  iconColor: 'currentColor',
  iconSize: 24
});
</script>

<template>
  <div class="template__not-found">
    <h6 class="ma-0">{{ text }}</h6>
    <v-icon :size="iconSize" :color="iconColor">{{icon}}</v-icon>
  </div>
</template>

<style scoped lang="scss">
.template__not-found{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
</style>