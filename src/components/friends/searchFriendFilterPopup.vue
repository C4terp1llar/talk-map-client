<script setup lang="ts">
import {ref} from "vue";
import {onClickOutside} from "@vueuse/core";
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";
import {rules} from "@/helpers/baseTextValidator";
import TextDivider from "@/components/common/textDivider.vue";
import SearchFriendFilterCity from "@/components/friends/searchFriendFilterCity.vue";

const filterStore = useFindFriendFilterStore()

const emit = defineEmits();

const gender = ref<'male' | 'female' | 'any'>(filterStore.genderFilter);
const minAge = ref<number>(filterStore.minAgeFilter);
const maxAge = ref<number>(filterStore.maxAgeFilter);
const city = ref<string | null>(filterStore.cityFilter);

const filterPopupRef = ref<HTMLElement | null>(null);

const clickOutside = () => {
  emit('close');
};
onClickOutside(filterPopupRef, clickOutside);

const handleAgeInput = (mode: 'min' | 'max') => {
  const currentModel = mode === 'min' ? minAge : maxAge;
  currentModel.value = Number(currentModel.value);
  if (mode === 'min') {
    if (minAge.value >= 14 && minAge.value <= 100 && (minAge.value <= maxAge.value)) {
      filterStore.minAgeFilter = minAge.value
    }
  } else {
    if (maxAge.value >= 14 && maxAge.value <= 100 && (minAge.value <= maxAge.value)) {
      filterStore.maxAgeFilter = maxAge.value
    }
  }
}

const handleAgeBlur = (mode: 'min' | 'max') => {
  if (mode === 'min') {
    if (!(minAge.value >= 14 && minAge.value <= 100 && (minAge.value <= maxAge.value))) {
      minAge.value = 14;
      filterStore.minAgeFilter = 14;
    }
  } else {
    if (!(maxAge.value >= 14 && maxAge.value <= 100 && (minAge.value <= maxAge.value))) {
      maxAge.value = 100;
      filterStore.maxAgeFilter = 100;
    }
  }
}

const clearAll = () => {
  gender.value = 'any';
  minAge.value = 14;
  maxAge.value = 100;
  city.value = null;
  filterStore.clearAll();
}
</script>

<template>
  <div class="search-friend-filter__wrapper" ref="filterPopupRef">

    <text-divider text="Город" class="mt-2 mb-2"/>

    <div class="filter__wrapper-option">
      <search-friend-filter-city/>
    </div>

    <text-divider text="Возраст" class="mt-2 mb-2"/>

    <div class="filter__wrapper-option">
      <div class="filter__wrapper-option-age">
        <div class="d-flex gap-2 align-items-center w-100">
          <span class="small">От: </span>
          <v-text-field @input="handleAgeInput('min')" @blur="handleAgeBlur('min')" :min="14" :max="100"
                        v-model="minAge" type="number" variant="outlined" hide-details/>
        </div>
        <div class="d-flex gap-2 align-items-center w-100">
          <span class="small">До: </span>
          <v-text-field @input="handleAgeInput('max')" @blur="handleAgeBlur('max')" :min="14" :max="100"
                        v-model="maxAge" type="number" variant="outlined" hide-details/>
        </div>
      </div>
    </div>

    <text-divider text="Пол" class="mt-2 mb-2"/>

    <div class="filter__wrapper-option">
      <v-radio-group
          v-model="gender"
          hide-details
          @change="filterStore.genderFilter = gender"
          class="m-auto"
          inline
      >
        <v-radio
            label="Мужской"
            value="male"
            class="m-auto"
        ></v-radio>
        <v-radio
            label="Женский"
            value="female"
            class="m-auto"
        ></v-radio>
        <v-radio
            label="Любой"
            value="any"
            class="m-auto"
        ></v-radio>
      </v-radio-group>
    </div>

    <hr>

    <v-btn
        color="green"
        variant="text"
        class="text-none"
        @click="clearAll"
    >Сбросить
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
.search-friend-filter__wrapper {
  padding: 15px;
  display: flex;
  flex-direction: column;

  background: rgb(var(--v-theme-background));
  border: 1px solid currentColor;
  border-radius: 5px;
  z-index: 9990;

  .filter__wrapper-option {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .filter__wrapper-option-age {
      display: flex;
      gap: 10px;
    }
  }
}


</style>