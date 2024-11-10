<script setup lang="ts">
import {ref} from "vue";
import SearchFriendFilterPopup from "@/components/friends/searchFriendFilterPopup.vue";
import SearchFriendFilterChips from "@/components/friends/searchFriendFilterChips.vue";
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";
import {useUserStore} from "@/stores/user";
import {useNotificationStore} from "@/stores/notifications";
import CircularLoader from "@/components/common/circularLoader.vue";
import SearchFriendSubBar from "@/components/friends/searchFriendSubBar.vue";

const filterStore = useFindFriendFilterStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

const isPopupOpen = ref<boolean>(false);
const searchQuery = ref<string | null>(null);

const handleClose = () => {
  setTimeout(() => {
    isPopupOpen.value = false;
  })
}

const handleSubmit = async () => {
  filterStore.nickFilter = searchQuery.value

  await userStore.findUsers({
    cityFilter: filterStore.cityFilter,
    minAgeFilter: filterStore.minAgeFilter,
    maxAgeFilter: filterStore.maxAgeFilter,
    genderFilter: filterStore.genderFilter,
    nicknameFilter: filterStore.nickFilter
  }, 'load')

  if (userStore.findUserError) {
    notificationStore.addNotification('error', userStore.findUserError, 3000)
  }
}
</script>

<template>
  <div>
    <v-fade-transition>
      <search-friend-filter-chips/>
    </v-fade-transition>

    <div class="search-friend-bar-wrapper">

      <v-btn
          type="submit"
          class="btn-change"
          variant="outlined"
          @click="isPopupOpen = true"
      >
        <v-icon>mdi-filter-outline</v-icon>
      </v-btn>

      <v-text-field
          v-model="searchQuery"
          class="w-100"
          variant="outlined"
          maxlength="80"
          hide-details="auto"
          @keydown.enter="handleSubmit"
      />

      <v-btn
          type="submit"
          class="btn-change"
          variant="outlined"
          @click="handleSubmit"
          :loading="userStore.findUserPending"
          :disabled="userStore.findUserPending"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </div>

    <div :class="['filter-wrapper', isPopupOpen ? 'collapse-animation' : 'expand-animation']" v-if="isPopupOpen">
      <search-friend-filter-popup @close="handleClose"/>
    </div>
  </div>
</template>

<style scoped>
.search-friend-bar-wrapper {
  position: relative;
  display: flex;
  gap: 10px;

  .btn-change {
    height: 56px;
  }
}

.filter-wrapper {
  margin: 5px 0;
}

</style>