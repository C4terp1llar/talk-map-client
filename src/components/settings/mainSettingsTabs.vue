<script setup lang="ts">
import {ref} from "vue";
import {useRouter, useRoute} from "vue-router";

type Tab = 'profile' | 'notifications' | 'security';

const router = useRouter();
const route = useRoute();

const activeTab = ref<Tab>(route.query.tab as Tab || 'profile')
</script>

<template>
  <div class="wrapper-settings-tabs__main">
    <v-tabs
        class="tabs"
        slider-color="green"
        align-tabs="center"
        show-arrows
        v-model="activeTab"
    >
      <v-tab
          class="text-none"
          prepend-icon="mdi-home-outline"
          @click="router.push({ path: route.path, query: { tab: 'profile' } })"
          value="profile"
      >
        Профиль
      </v-tab>
      <v-tab
          class="text-none"
          prepend-icon="mdi-bell-outline"
          @click="router.push({ path: route.path, query: { tab: 'notifications' } })"
          value="notifications"
      >
        Уведомления
      </v-tab>
      <v-tab
          class="text-none"
          prepend-icon="mdi-shield-account-outline"
          @click="router.push({ path: route.path, query: { tab: 'security' } })"
          value="security"
      >
        Безопасность
      </v-tab>
    </v-tabs>
  </div>
</template>

<style scoped>
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
