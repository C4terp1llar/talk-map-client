<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed, ref} from "vue";
import ScrollableContainer from "@/components/common/scrollableContainer.vue";
import ShortCounter from "@/components/common/shortCounter.vue";

const router = useRouter();
const route = useRoute();

type Tab = 'friends' | 'search' | 'incoming' | 'outgoing';


const activeTab = computed(() => route.query.tab as Tab | 'friends')

</script>

<template>

  <div class="wrapper-friends-tabs__main">


    <v-tabs
        :model-value="activeTab"
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
          class="text-none d-flex align-items-center"
          prepend-icon="mdi-arrow-down-bold-outline"
          value="incoming"
          @click="router.push({ path: route.path, query: { tab: 'incoming' } })"
      >
        Входящие
        <short-counter class="ml-1" mode="friends" :is-friends-tab="true"/>
      </v-tab>

      <v-tab
          class="text-none"
          prepend-icon="mdi-arrow-up-bold-outline"
          value="outgoing"
          @click="router.push({ path: route.path, query: { tab: 'outgoing' } })"
      >
        Исходящие
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
