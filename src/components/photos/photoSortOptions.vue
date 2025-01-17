<script setup lang="ts">
import {ref} from "vue";
import {onClickOutside} from "@vueuse/core";

interface Props{
  model: 'publish_asc' | 'publish_desc'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'change', sortType: 'publish_asc' | 'publish_desc'): void,
  (e: 'close'): void
}>()

const sort = ref<'publish_desc' | 'publish_asc'>(props.model || 'publish_desc');

const sortMenuRef = ref<HTMLElement | null>(null);

const clickOutside = () => {
  emit('close');
};
onClickOutside(sortMenuRef, clickOutside);

const handleChange = () => {
  emit('change', sort.value);
  emit('close')
}
</script>

<template>
  <div class="photo-sort__menu" ref="sortMenuRef">

    <v-radio-group
        hide-details
        v-model="sort"
        @change="handleChange"
    >
      <v-radio
          label="Дата публикации (↑)"
          value="publish_asc"
      ></v-radio>
      <v-radio
          label="Дата публикации (↓)"
          value="publish_desc"
      ></v-radio>
    </v-radio-group>

  </div>
</template>

<style scoped lang="scss">
.photo-sort__menu{
  z-index: 15;
  position: absolute;
  right: 0;
  top: 130%;
  padding: 7px;
  border-radius: 15px;
  box-shadow: 0 1px 10px currentColor;
  background: rgb(var(--v-theme-background));
}
</style>