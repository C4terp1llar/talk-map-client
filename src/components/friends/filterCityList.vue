<script setup lang="ts">
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";
import type {Address, ShortAddress} from "@/helpers/interfaces";

const emit = defineEmits();
const filterStore = useFindFriendFilterStore();

const nameString = (item: ShortAddress): string => {
  if (item.city && item.state && item.country) {
    return `${item.city}, ${item.state}, ${item.country}`
  } else if (item.city && item.country) {
    return `${item.city}, ${item.country}`
  } else {
    return item.display_name.split(', ').reverse().slice(0, 6).reverse().join(', ');
  }
}
</script>

<template>
  <ul class="search-friend-filter-city__list" v-if="filterStore.guessCities.length && !filterStore.pending">
    <li class="search-friend-filter-city__list-item" v-for="item in filterStore.guessCities" :key="item.display_name">
      <span class="address-text text-center">{{nameString(item)}}</span>
      <button @click="emit('select', item)"></button>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.search-friend-filter-city__list{
  display: flex;
  flex-direction: column;
  list-style: none;
  background-color: rgb(var(--v-theme-background));
  margin: 0;
  padding: 10px;
  border: 1px solid currentColor;
  border-radius: 5px;

  max-height: 240px;
  overflow-y: auto;

  .search-friend-filter-city__list-item{
    position: relative;
    display: flex;
    justify-content: center;
    padding: 10px 5px;
    border-radius: 5px;

    transition: .3s;

    background-color: rgb(var(--v-theme-background)) !important;
    &:hover{
      filter: brightness(0.85);
    }

    button{
      position: absolute;
      inset: 0;
    }
  }
}

.search-friend-filter-city__list::-webkit-scrollbar {
  width: 8px;
  margin-right: 5px;
}

.search-friend-filter-city__list::-webkit-scrollbar-thumb {
  background-color: #c4c4c4;
  border-radius: 15px;
}

.search-friend-filter-city__list::-webkit-scrollbar-track {
  margin: 10px;
  background: #777777;
  border-radius: 15px;
}
</style>