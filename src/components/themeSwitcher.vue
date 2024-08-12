<template>
  <div class="theme-switcher">
    <v-switch
        :false-icon="sunIcon"
        :true-icon="moonIcon"
        @change="themeStore.toggleTheme()"
        inset
    />
  </div>
</template>

<script setup>
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
