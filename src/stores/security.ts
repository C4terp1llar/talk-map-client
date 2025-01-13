import { defineStore } from "pinia";
import { ref } from "vue";

export const useSecurityStore = defineStore('security', () => {
    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);


    return {
        pending,
        error,
    };
});
