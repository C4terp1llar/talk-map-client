<script setup lang="ts">
import Switcher from "@/components/common/switcher.vue";

const emit = defineEmits(['switch'])

interface Props {
  disabled: boolean;
  check: boolean;
  name: string;
}

defineProps<Props>()

</script>

<template>
  <div class="switch-template__wrapper">
    <h6 class="ma-0">{{name}}</h6>
    <switcher @switch="emit('switch')" :disabled="disabled" :check="check"/>
  </div>
</template>

<style scoped lang="scss">
.switch-template__wrapper{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>