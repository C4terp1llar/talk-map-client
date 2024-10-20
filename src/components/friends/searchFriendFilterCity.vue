<script setup lang="ts">
import {ref} from "vue";
import FilterCityList from "@/components/friends/filterCityList.vue";
import {debounce} from "perfect-debounce";
import {useNotificationStore} from "@/stores/notifications";
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";
import type {ShortAddress} from "@/helpers/interfaces";
import CircularLoader from "@/components/common/circularLoader.vue";

const city = ref<string | null>(null)
const notificationStore = useNotificationStore();
const filterStore = useFindFriendFilterStore();

const debouncedOperation = debounce(async () => {
  if (!city.value) return;

  filterStore.guessCities = [];

  const message = await filterStore.getAddresses(city.value);

  if (message) {
    notificationStore.addNotification('info', message, 3000);
  }

  if (filterStore.error) {
    notificationStore.addNotification('error', filterStore.error, 3000);
  }
}, 1000);

const handleSelect = (address: ShortAddress) => {
  filterStore.cityFilter = address.city;
  handleClose()
}

const handleClose = () => {
  filterStore.guessCities = [];
  city.value = null;
}
</script>

<template>
  <div class="search-friend-filter-city">
    <v-text-field
        v-model="city"
        class="w-100"
        variant="outlined"
        maxlength="50"
        hide-details="auto"
        @input="debouncedOperation"
    >
      <template v-slot:append-inner>
        <circular-loader :size="15" v-if="filterStore.pending"/>
        <button v-if="!filterStore.pending && filterStore.guessCities.length" @click="handleClose">
          <v-icon>mdi-close</v-icon>
        </button>
      </template>
    </v-text-field>

    <div class="search-friend-filter-city__list-wrapper">
      <filter-city-list @select="payload => handleSelect(payload)" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-friend-filter-city{
  list-style-type: none;
  display: flex;
  flex-direction: column;
  position: relative;

  .search-friend-filter-city__list-wrapper{
    position: absolute;
    top: 60px;
    width: 100%;
    z-index: 9990;
  }
}




</style>