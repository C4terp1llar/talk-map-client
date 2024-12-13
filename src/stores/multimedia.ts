import { defineStore } from "pinia";
import apiAuth from "@/utils/apiAuth";
import { ref } from "vue";

export const useMultimediaStore = defineStore('multimedia', () => {
    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);
    const progress = ref<number>(0);

    const isMenuOpen = ref<boolean>(false);

    const upload = async (formData: FormData, info: {key: string, value: any}[]) => {
        pending.value = true;
        error.value = null;
        progress.value = 0;

        info.forEach(entry => {
            formData.append(entry.key, entry.value);
        });

        try {
            const response = await apiAuth.post("user/uploadMedia", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total && progressEvent.lengthComputable) {
                        progress.value = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                    }
                },
            });

            if (response.data && response.status === 200) {
                console.log(response.data.files);
            }
        } catch (e: any) {
            error.value = "Произошла ошибка при загрузке файлов, попробуйте позже";
            console.error(e);
        } finally {
            pending.value = false;
            progress.value = 0;
        }
    };

    return {
        pending,
        error,
        progress,
        isMenuOpen,
        upload,
    };
});
