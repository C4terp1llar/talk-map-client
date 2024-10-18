<script setup lang="ts">
import {ref} from "vue";
import SearchFriendFilterPopup from "@/components/friends/searchFriendFilterPopup.vue";

const isPopupOpen = ref<boolean>(false);
const searchQuery = ref<string>('')

const handleClose = () => {
  setTimeout(() => {
    isPopupOpen.value = false;
  })
}
</script>

<template>
  <div class="search-friend-bar-wrapper">
    <div class="filter-wrapper">
      <v-scroll-y-transition>
        <search-friend-filter-popup @close="handleClose" v-if="isPopupOpen"/>
      </v-scroll-y-transition>
    </div>

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
    />

    <v-btn
        type="submit"
        class="btn-change"
        variant="outlined"
    >
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </div>
</template>

<style scoped>
.search-friend-bar-wrapper{
  position: relative;
  display: flex;
  gap: 10px;

  .filter-wrapper{
    position: absolute;
    top: 65px;
    left: 0;
  }

  .btn-change{
    height: 56px;
  }
}
</style>