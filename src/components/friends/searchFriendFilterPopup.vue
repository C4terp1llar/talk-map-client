<script setup lang="ts">
import { ref} from "vue";
import {onClickOutside} from "@vueuse/core";
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";

const filterStore = useFindFriendFilterStore()

const emit = defineEmits();

const gender = ref<'male' | 'female' | null>(filterStore.userFindFriendFilter.gender || null);
const age = ref< (string | number)[]>(filterStore.userFindFriendFilter.age || [14, 100]);
const city = ref<string | null>(filterStore.userFindFriendFilter.city || null);

const filterPopupRef = ref<HTMLElement | null>(null);

const clickOutside = () => {
  emit('close');
};
onClickOutside(filterPopupRef, clickOutside);

const clearAll = () => {
  gender.value = null;
  age.value = [14, 100];
  city.value = null;
  filterStore.clearAll();
}
</script>

<template>
  <div class="search-friend-filter__wrapper" ref="filterPopupRef">

    <div class="filter__wrapper-option">
      <span class="align-self-center">Город</span>
      <v-text-field
          v-model="city"
          class="w-100"
          variant="outlined"
          maxlength="20"
          hide-details="auto"
          @input="filterStore.userFindFriendFilter.city = city"
      />
    </div>

    <hr>

    <div class="filter__wrapper-option">
      <span class="align-self-center">Возраст</span>
      <div class="filter__wrapper-option-age">
        <v-text-field class="text-age-field" :min="14" :max="100" v-model="age[0]" type="number" variant="outlined" hide-details/>
        <v-range-slider
            v-model="age"
            :max="100"
            :min="14"
            :step="1"
            hide-details
            strict
            class="age-range"
            @update:model-value="filterStore.userFindFriendFilter.age = age"
        ></v-range-slider>
        <v-text-field class="text-age-field" :min="14" :max="100" v-model="age[1]" type="number" variant="outlined" hide-details/>
      </div>
    </div>

    <hr>

    <div class="filter__wrapper-option">
      <span class="align-self-center">Пол</span>
      <v-radio-group
          v-model="gender"
          hide-details
          inline
          class="ma-auto"
          @change="filterStore.userFindFriendFilter.gender = gender"
      >
        <v-radio
            label="Мужской"
            value="male"
        ></v-radio>
        <v-radio
            label="Женский"
            value="female"
        ></v-radio>
      </v-radio-group>
    </div>

    <hr>

    <v-btn
      color="green"
      variant="text"
      class="text-none"
      @click="clearAll"
    >Сбросить</v-btn>
  </div>
</template>

<style scoped lang="scss">
.search-friend-filter__wrapper {
  padding: 15px;
  display: flex;
  flex-direction: column;

  min-width: 350px;

  background: rgb(var(--v-theme-background));
  box-shadow: 0 1px 10px currentColor;
  border-radius: 15px;
  z-index: 9990;

  @media screen and (max-width: 400px) {
    min-width: 150px;
  }

  .filter__wrapper-option{
    display: flex;
    flex-direction: column;
    justify-content: center;

    .filter__wrapper-option-age{
      display: grid;
      grid-template-columns: 75px 1fr 75px;
      gap: 10px;
      align-items: center;

      @media screen and (max-width: 400px) {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;

        .age-range{
          grid-row: 1;
          grid-column: span 2;
        }
      }
    }


  }
}
</style>