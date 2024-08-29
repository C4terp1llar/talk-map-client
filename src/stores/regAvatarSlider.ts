import {defineStore} from 'pinia';
import {ref} from "vue";

export const useAvatarSliderStore = defineStore('avatar', () => {

    const currentSlide = ref<number>(0);
    const avatars = ref<string[]>([]);

    // const error = ref<string | null>(null);
    // const pending = ref<boolean>(false);


    const handleGetCommonAvatars = () => {
        // pending.value = true;
        // error.value = null;
        //
        // try {
        //     const response = await api.get('auth/avatars');
        //     avatars.value = response.data;
        // }catch (e: any) {
        //     error.value = "Произошла ошибка, попробуйте позже";
        //     console.error(e);
        // }finally {
        //     pending.value = false
        // }
        avatars.value = [
            ' https://i.postimg.cc/1tWjbS4x/a7.webp',
            'https://i.postimg.cc/cCRdQ6X7/aa2.webp',
            'https://i.postimg.cc/h4T4F3cJ/aa3.webp',
            ' https://i.postimg.cc/MKw6zbp9/aa4.webp',
            ' https://i.postimg.cc/SNGyR2Xk/aa5.webp',
            ' https://i.postimg.cc/HksTyY55/aa6.webp',
            'https://i.postimg.cc/Qd4hg2kz/aa7.webp',
            ' https://i.postimg.cc/5tX1sss2/aa9.webp'

        ]
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
        // pending,
        // error,
        avatars,
        currentSlide,
        handleGetCommonAvatars,
        prevSlide,
        nextSlide
    }
})