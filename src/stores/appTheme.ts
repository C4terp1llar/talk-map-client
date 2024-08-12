import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppThemeStore = defineStore('theme', () => {
    const currentTheme = ref<'light' | 'dark'>('light');

    const toggleTheme = () => {
        currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
    };

    return {
        currentTheme,
        toggleTheme,
    };
});