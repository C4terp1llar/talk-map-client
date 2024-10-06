<script setup lang="ts">
import {ref} from "vue";
import {useRouter, useRoute} from "vue-router";

const router = useRouter();
const route = useRoute();


const activeTab = ref<string>(route.name as string);

const changeTab = (tabName: string) => {
  router.push({name: tabName});
  activeTab.value = tabName;
};
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
          @click="changeTab('settings-profile')"
          value="settings-profile"
      >
        Профиль
      </v-tab>
      <v-tab
          class="text-none"
          prepend-icon="mdi-bell-outline"
          @click="changeTab('settings-notifications')"
          value="settings-notifications"
      >
        Уведомления
      </v-tab>
      <v-tab
          class="text-none"
          prepend-icon="mdi-shield-account-outline"
          @click="changeTab('settings-security')"
          value="settings-security"
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
