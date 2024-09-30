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

export const useImagePopupStore = defineStore('imagePopup', () => {

    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);

    const isPopupVisible = ref<boolean>(false);

    const senderType = ref<'wallpaper' | 'avatar' | ''>('');
    const modeType = ref<'single' | 'many' | ''>('')
    const actionType = ref<'upload' | 'crop' | ''>('')

    const cropImageData = ref<(string | ArrayBuffer)[]>([])

    const openPopup = (mode: 'single' | 'many', sender: 'wallpaper' | 'avatar', type: 'upload' | 'crop') => {
        modeType.value = mode;
        senderType.value = sender;
        actionType.value = type
        isPopupVisible.value = true;
        lockScroll();
    }

    const closePopup = () => {
        modeType.value = '';
        senderType.value = '';
        actionType.value = '';
        cropImageData.value = []
        isPopupVisible.value = false;
        unlockScroll();
    }

    return {
        pending,
        error,
        isPopupVisible,
        senderType,
        modeType,
        actionType,
        cropImageData,
        openPopup,
        closePopup,
    }
})