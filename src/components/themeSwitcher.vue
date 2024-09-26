<template>
  <div class="theme-switcher">
    <v-switch
        class="switch"
        hide-details
        :false-icon="sunIcon"
        :true-icon="moonIcon"
        @change="themeStore.toggleTheme()"
        inset
    />

  </div>
</template>

<script setup lang="ts">
import {useAppThemeStore} from "@/stores/appTheme.ts";

const themeStore = useAppThemeStore();

const sunIcon = 'mdi-weather-sunny';
const moonIcon = 'mdi-weather-night';

</script>

<style scoped>

.theme-switcher {
  display: flex;
  align-items: center;
}

</style>
