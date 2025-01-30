<script setup lang="ts">
import type {FullMessage} from "@/helpers/interfaces";

interface Props {
  m: FullMessage
}

const props = defineProps<Props>()
</script>

<template>
  <div :class="['message-item__wrapper', m.mode === 'internal' ? 'ml-auto' : 'mr-auto']">
    {{m.content || 'asd'}}
  </div>
</template>

<style scoped lang="scss">
.message-item__wrapper{
  max-width: 50%;
}
</style>