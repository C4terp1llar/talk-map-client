import { defineStore } from 'pinia';
import { ref } from 'vue';

const loadThemeFromLocalStorage = (): 'light' | 'dark' => {
    const savedTheme = localStorage.getItem('appTheme');
    return savedTheme ? (savedTheme as 'light' | 'dark') : 'light';
};

const saveThemeToLocalStorage = (theme: 'light' | 'dark') => {
    localStorage.setItem('appTheme', theme);
};

export const useAppThemeStore = defineStore('theme', () => {
    const currentTheme = ref<'light' | 'dark'>(loadThemeFromLocalStorage());

    const toggleTheme = () => {
        currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
        saveThemeToLocalStorage(currentTheme.value);
    };

    return {
        currentTheme,
        toggleTheme,
    };
});