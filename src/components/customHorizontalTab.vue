<script setup lang="ts">
interface Props{
  text: string,
  open: boolean
}
defineProps<Props>()

const emit = defineEmits(['actTab'])
</script>

<template>

  <div class="horizontal-tab__wrapper">
    <h5 class="ma-0">{{text}}</h5>
    <v-icon :size="28" color="green">{{open ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
    <button @click="emit('actTab')"></button>
  </div>

</template>

<style scoped lang="scss">
.horizontal-tab__wrapper{
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 2px;
  border-radius: 5px;
  transition: .3s;
  position: relative;

  &:hover {
    background-color: rgba(211, 211, 211, 0.25);
  }

  button{
    position: absolute;
    inset: 0;
  }
}
</style>