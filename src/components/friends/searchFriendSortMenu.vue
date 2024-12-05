<script setup lang="ts">
import {ref} from "vue";
import {onClickOutside} from "@vueuse/core";
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";

const emit = defineEmits(['close'])

const refSortMenu = ref<HTMLDivElement | null>(null);

const clickOutside = () => {
  emit('close')
};

onClickOutside(refSortMenu, clickOutside);

const filterStore = useFindFriendFilterStore();
const age = ref<string>('' || filterStore.sortStr);

const handleChangeAgeSort = () => {
  if (filterStore.sortStr.includes('age_')) {
    filterStore.sortStr = filterStore.sortStr.replace(/age_(asc|desc)/, '').trim();
  }

  filterStore.sortStr += age.value;
}


// ↑, ↓.
</script>

<template>
  <div class="search-friend-sort-menu__wrapper" ref="refSortMenu">
    <v-radio-group
        hide-details
        v-model="age"
        @change="handleChangeAgeSort"
    >
      <v-radio
          label="По возрасту (↑)"
          value="age_asc"
      ></v-radio>
      <v-radio
          label="По возрасту (↓)"
          value="age_desc"
      ></v-radio>
    </v-radio-group>

    <v-divider class="mt-1 mb-1"></v-divider>

    <v-btn
        color="green"
        variant="text"
        class="text-none w-100"
        @click="filterStore.sortStr = ''"
    >
      Сбросить
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
.search-friend-sort-menu__wrapper {
  z-index: 10;
  padding: 15px;
  border-radius: 15px;
  box-shadow: 0 1px 10px currentColor;
  background: rgb(var(--v-theme-background));
  width: 100%;
}

.filter__wrapper-option {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .filter__wrapper-option-age {
    display: flex;
    gap: 10px;
  }
}
</style>