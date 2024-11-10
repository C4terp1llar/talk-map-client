<script setup lang="ts">
import {ref} from "vue";
import {onClickOutside} from "@vueuse/core";

const emit = defineEmits(['close'])

const refSortMenu = ref<HTMLDivElement | null>(null);

const clickOutside = () => {
  emit('close')
};

onClickOutside(refSortMenu, clickOutside);
</script>

<template>
  <div class="search-friend-sort-menu__wrapper" ref="refSortMenu">
    тут будут какие-то
    фильтры для сортировки
    возраст,
  </div>
</template>

<style scoped lang="scss">
.search-friend-sort-menu__wrapper {
  z-index: 10;
  padding: 15px;
  border-radius: 15px;
  box-shadow: 0 1px 10px currentColor;
  background: rgb(var(--v-theme-background));
}
</style>