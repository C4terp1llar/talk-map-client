import {defineStore} from 'pinia';
import {ref} from "vue";
import api from "@/utils/api";

export const useAvatarSliderStore = defineStore('avatar', () => {

    const currentSlide = ref<number>(0);
    const avatars = ref<string[]>([]);

    const error = ref<string | null>(null);
    const pending = ref<boolean>(false);


    const handleGetCommonAvatars = async () => {
        pending.value = true;
        error.value = null;

        try {
            const response = await api.get(`reg/getCommonAvatars`)
            avatars.value = response.data
        }catch (e) {
            error.value = "Произошла ошибка, попробуйте позже";
            console.error(e);
        }finally {
            pending.value = false;
        }
    }

    const prevSlide = () => {
        if (currentSlide.value > 0) {
            currentSlide.value--;
        } else {
            currentSlide.value = avatars.value.length - 1;
        }
    };

    const nextSlide = () => {
        if (currentSlide.value < avatars.value.length - 1) {
            currentSlide.value++;
        } else {
            currentSlide.value = 0;
        }
    };

    return {
        pending,
        error,
        avatars,
        currentSlide,
        handleGetCommonAvatars,
        prevSlide,
        nextSlide
    }
})