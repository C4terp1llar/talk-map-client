<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed, ref} from "vue";
import ScrollableContainer from "@/components/common/scrollableContainer.vue";

const router = useRouter();
const route = useRoute();

type Tab = 'friends' | 'search';

const activeTab = ref<Tab>(route.query.tab as Tab || 'friends')

</script>

<template>
  <div class="wrapper-friends-tabs__main">


    <v-tabs
        v-model="activeTab"
        class="tabs"
        slider-color="green"
        align-tabs="center"
        show-arrows
    >
      <v-tab
          class="text-none"
          prepend-icon="mdi-account"
          value="friends"
          @click="router.push({ path: route.path, query: { tab: 'friends' } })"
      >
        Друзья
      </v-tab>

      <v-tab
          class="text-none"
          prepend-icon="mdi-magnify"
          value="search"
          @click="router.push({ path: route.path, query: { tab: 'search' } })"
      >
        Поиск
      </v-tab>

    </v-tabs>
  </div>
</template>

<style scoped lang="scss">
.wrapper-friends-tabs__main {
  width: 100%;
  display: grid;

  .tabs {
    height: auto;
    padding: 15px 0;
    border-radius: 15px;
    box-shadow: 0 1px 10px currentColor;
  }
}
</style>
