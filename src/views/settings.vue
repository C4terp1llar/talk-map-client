<script setup lang="ts">

import MainSettingsTabs from "@/components/settings/mainSettingsTabs.vue";
import SettingsNotifications from "@/components/settings/settingsNotifications.vue";
import SettingsSecurity from "@/components/settings/settingsSecurity.vue";
import SettingsProfile from "@/components/settings/settingsProfile.vue";
import {useRoute} from "vue-router";
import {type Component, computed} from "vue";

type Tab = 'profile' | 'notifications' | 'security';

const route = useRoute();

const activeTab = computed<Tab>(() => {
  return route.query.tab as Tab || 'profile';
});

const componentsMap: Record<Tab, Component> = {
  profile: SettingsProfile,
  notifications: SettingsNotifications,
  security: SettingsSecurity
};

</script>

<template>
  <div class="settings-wrapper">
    <main-settings-tabs/>

    <component :is="componentsMap[activeTab]" />
  </div>
</template>

<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 15px;
}
</style>
