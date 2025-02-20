<script setup lang="ts">
import {rules} from "@/helpers/baseTextValidator";
import {ref} from "vue";
import {onClickOutside} from "@vueuse/core";

interface Props{
  val: string;
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'updTitle', title: string): void
  (e: 'updTitleHandle'): void
  (e: 'close'): void
}>()

const title = ref<string>(props.val || '');

const changeTitleBlock = ref<HTMLElement | null>(null);

onClickOutside(changeTitleBlock, e => handleClose())
const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="change-conv__title" ref="changeTitleBlock">
    <v-text-field
        focused
        autofocus
        v-model="title"
        :rules="[rules.required, rules.fieldSymbolsEditorField(title)]"
        variant="outlined"
        @input="emit('updTitle', title)"
        hide-details="auto"
        maxlength="30"
        class="w-100"
        density="comfortable"
        append-inner-icon="mdi-close"
        @click:append-inner="emit('close')"
        append-icon="mdi-send"
        @click:append="emit('updTitleHandle')"
    />
  </div>
</template>

<style scoped lang="scss">
.change-conv__title{
  padding: 5px;
  width: 100%;
  display: flex;
}
</style>