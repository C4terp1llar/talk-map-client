import {defineStore} from "pinia";
import {ref} from "vue";

const lockScroll = () => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.dataset.scrollY = scrollY.toString(); // Сохраняем текущую прокрутку
}

const unlockScroll = () => {
    const scrollY = document.body.dataset.scrollY || '0';
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY)); // Возвращаем прокрутку на прежнее место
    document.body.dataset.scrollY = ''; // Очищаем сохраненную прокрутку
}

export const useImageUploadStore = defineStore('image', () => {

    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);

    const isPopupVisible = ref<boolean>(false);

    const uploadSender = ref<'wallpaper' | ''>('');
    const uploadMode = ref<'single' | 'many' | ''>('')

    const openPopup = (mode: 'single' | 'many', sender: 'wallpaper' | '') => {
        uploadMode.value = mode;
        uploadSender.value = sender
        isPopupVisible.value = true;
        lockScroll();
    }

    const closePopup = () => {
        uploadMode.value = '';
        uploadSender.value = '';
        isPopupVisible.value = false;
        unlockScroll();
    }

    return {
        pending,
        error,
        isPopupVisible,
        uploadSender,
        uploadMode,
        openPopup,
        closePopup,
    }
})