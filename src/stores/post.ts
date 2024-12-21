import { defineStore } from "pinia";
import apiAuth from "@/utils/apiAuth";
import { ref } from "vue";

export const usePostStore = defineStore('post', () => {
    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);

    const createPost = async (postText: string, formData: FormData | undefined, info: {key: string, value: any}[]) => {
        pending.value = true;
        error.value = null;

        let lcData: FormData;

        if (formData){
            info.forEach(entry => {
                formData.append(entry.key, entry.value);
            });

            formData.append('text', postText);
            lcData = formData
        }else{
            lcData = new FormData();
            lcData.append('text', postText);
            info.forEach(entry => {
                lcData.append(entry.key, entry.value);
            });
        }

        try {
            const response = await apiAuth.post("user/post", lcData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.data && response.status === 200) {
                console.log(response.data);
            }
        } catch (e: any) {
            error.value = "Произошла ошибка при создании поста, попробуйте позже";
            console.error(e);
        } finally {
            pending.value = false;
        }
    };

    return {
        pending,
        error,
        createPost,
    };
});
