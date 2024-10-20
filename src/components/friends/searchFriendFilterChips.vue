<script setup lang="ts">
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";
import ScrollableContainer from "@/components/common/scrollableContainer.vue";

const filterStore = useFindFriendFilterStore();
</script>

<template>
  <div class="search-filter-chips-wrapper"
       v-if="filterStore.cityFilter || (filterStore.minAgeFilter != 14 || filterStore.maxAgeFilter != 100) || (filterStore.genderFilter && filterStore.genderFilter !== 'any')"
  >
    <scrollable-container mode="filter">
      <div class="search-filter-chips-wrapper__content">
        <v-fade-transition>
          <div class="chip __city" v-if="filterStore.cityFilter">
            <span>Город: {{ filterStore.cityFilter }}</span>
            <button class="delete-btn" @click="filterStore.cityFilter = null">
              <v-icon size="small" color="red">mdi-trash-can-outline</v-icon>
            </button>
          </div>
        </v-fade-transition>

        <v-fade-transition>
          <div class="chip __age" v-if="filterStore.minAgeFilter != 14 || filterStore.maxAgeFilter != 100">
            <span>Возраст: от {{ filterStore.minAgeFilter }} до {{ filterStore.maxAgeFilter }}</span>
            <button class="delete-btn" @click="filterStore.minAgeFilter = 14; filterStore.maxAgeFilter = 100">
              <v-icon size="small" color="red">mdi-trash-can-outline</v-icon>
            </button>
          </div>
        </v-fade-transition>

        <v-fade-transition>
          <div class="chip __gender" v-if="filterStore.genderFilter && filterStore.genderFilter !== 'any'">
            <span>Пол: {{ filterStore.genderFilter === 'male' ? 'Мужской' : 'Женский' }}</span>
            <button class="delete-btn" @click="filterStore.genderFilter = 'any'">
              <v-icon size="small" color="red">mdi-trash-can-outline</v-icon>
            </button>
          </div>
        </v-fade-transition>

      </div>
    </scrollable-container>
  </div>
</template>

<style scoped lang="scss">
.search-filter-chips-wrapper__content {
  display: flex;
  justify-content: center;
  gap: 10px;

  .chip {
    padding: 10px;
    border-radius: 15px;
    border: 1px solid currentColor;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      margin-left: 10px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
    }
  }
}

.delete-btn {
  transition: .3s;
  opacity: 1;

  &:hover {
    filter: drop-shadow(0 0 3px rgba(255, 0, 0, 0.45));
  }
}
</style>
