<script setup lang="ts">
import {vAutoAnimate} from '@formkit/auto-animate/vue';
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";
import ScrollableContainer from "@/components/common/scrollableContainer.vue";

const filterStore = useFindFriendFilterStore()
</script>

<template>
  <div class="search-filter-chips-wrapper">

    <scrollable-container>
      <div class="search-filter-chips-wrapper__content">
        <div class="chip __city" v-if="filterStore.userFindFriendFilter.city">
          <span>Город: {{filterStore.userFindFriendFilter.city}}</span>
        </div>

        <div class="chip __age" v-if="filterStore.userFindFriendFilter.age">
          <span>Возраст: от {{filterStore.userFindFriendFilter.age[0]}} до {{filterStore.userFindFriendFilter.age[1]}}</span>
        </div>

        <div class="chip __gender" v-if="filterStore.userFindFriendFilter.gender">
          <span>Пол: {{filterStore.userFindFriendFilter.gender === 'male' ? 'Мужской' : 'Женский'}}</span>
        </div>
      </div>
    </scrollable-container>

  </div>
</template>

<style scoped lang="scss">
.search-filter-chips-wrapper__content{
  display: flex;
  justify-content: center;
  gap: 10px;

  .chip{
    padding: 10px;
    border-radius: 15px;
    border: 1px solid currentColor;
  }
}
</style>