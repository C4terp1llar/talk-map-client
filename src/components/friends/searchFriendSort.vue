<script setup lang="ts">
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";
import {useUserStore} from "@/stores/user";
import {computed, ref} from "vue";
import SearchFriendSortMenu from "@/components/friends/searchFriendSortMenu.vue";

interface Props {
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const isMenuVisible = ref<boolean>(false)

const handleClose = () => {
  setTimeout(() => {
    isMenuVisible.value = false;
  }, 0)
}
</script>

<template>
  <div class="search-friend-sort__wrapper">

    <v-btn
        :disabled="props.disabled"
        @click="isMenuVisible = true"
        variant="outlined"
    >
      <v-icon>mdi-sort</v-icon>
    </v-btn>


    <div class="search-friend-sort__menu">
      <v-scroll-y-transition>
        <search-friend-sort-menu v-if="isMenuVisible" @close="handleClose"/>
      </v-scroll-y-transition>
    </div>

  </div>
</template>

<style scoped lang="scss">
.search-friend-sort__wrapper {
  position: relative;

  .search-friend-sort__menu {
    position: absolute;
    z-index: 10;
    margin-top: 5px;
    width: 200px;
  }
}
</style>