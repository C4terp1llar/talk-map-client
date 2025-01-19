<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed} from "vue";

type Tab = 'personal' | 'channels';

const router = useRouter();
const route = useRoute();

const activeTab = computed(() => route.query.tab as Tab || 'personal')
</script>

<template>
  <div class="wrapper-settings-tabs__main">
    <v-tabs
        class="tabs"
        slider-color="green"
        align-tabs="center"
        show-arrows
        :model-value="activeTab"
    >
      <v-tab
          class="text-none"
          prepend-icon="mdi-message-processing-outline"
          @click="router.push({ path: route.path, query: { tab: 'personal' } })"
          value="personal"
      >
        Личное
      </v-tab>
      <v-tab
          class="text-none"
          prepend-icon="mdi-newspaper"
          @click="router.push({ path: route.path, query: { tab: 'channels' } })"
          value="channels"
      >
        Каналы
      </v-tab>
    </v-tabs>
  </div>
</template>

<style scoped lang="scss">
.wrapper-settings-tabs__main  {
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