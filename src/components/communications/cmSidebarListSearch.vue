<script setup lang="ts">
import { ref } from "vue";

interface Props{
  pending: boolean
}
defineProps<Props>()

const emit = defineEmits<{
  (e: "updateQueryValue", value: string): void;
}>();

const q = ref<string>("");

const appendSearchIconClick = () => {
  if (q.value) {
    q.value = "";
    emit('updateQueryValue', q.value)
  }
};

</script>

<template>
  <div class="sm-sidebar-list-search__wrapper">
    <v-text-field
        v-model.trim="q"
        variant="outlined"
        @keydown.enter="appendSearchIconClick"
        hide-details
        placeholder="Поиск"
        :append-inner-icon="!q ? 'mdi-magnify' : 'mdi-close'"
        @click:append-inner="appendSearchIconClick"
        @input="emit('updateQueryValue', q)"
        :loading="pending"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
