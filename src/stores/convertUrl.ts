import { defineStore } from "pinia";
import { ref } from "vue";

export const useConvertUrlStore = defineStore('convertUrl', () => {

    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);

    const urlToBase64 = async (url: string): Promise<string | null> => {
        pending.value = true;
        error.value = null;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();

            return await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error("Ошибка при чтении файла"));
                reader.readAsDataURL(blob);
            });
        } catch (err) {
            error.value = (err as Error).message;
            console.error("Ошибка конвертации URL в Base64");
            return null;
        } finally {
            pending.value = false;
        }
    };

    return {
        pending,
        error,
        urlToBase64
    }
});
