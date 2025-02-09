<script setup lang="ts">
interface Props {
  pending: boolean;
  modelValue: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const appendSearchIconClick = () => {
  if (props.modelValue) {
    emit("update:modelValue", "");
  }
};
</script>

<template>
  <div class="sm-sidebar-list-search__wrapper">
    <v-text-field
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        variant="outlined"
        @keydown.enter="appendSearchIconClick"
        hide-details
        placeholder="Поиск"
        :append-inner-icon="!modelValue ? 'mdi-magnify' : 'mdi-close'"
        @click:append-inner="appendSearchIconClick"
        :loading="pending"
    />
  </div>
</template>

<style scoped lang="scss">
</style>
