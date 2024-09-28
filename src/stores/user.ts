import {defineStore} from "pinia";
import {ref} from "vue";
import apiAuth from "@/utils/apiAuth";
import Wallpaper from "@/components/home/wallpaper.vue";

interface MainUserInfo {
    email: string;
    nickname: string;
    b_date: string;
    gender: 'male' | 'female';
    avatar: string;
    wallpaper?: string;
}

interface UserAddress {
    lat: string;
    lon: string;
    address: string;
}

export const useUserStore = defineStore('user', () => {
    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);

    const mainUserInfo = ref< MainUserInfo | null>(null)
    const userAddressInfo = ref< UserAddress | null>(null)

    const getMainUserInfo = async () => {
        pending.value = true;
        error.value = null;

        mainUserInfo.value = null
        userAddressInfo.value = null

        try {
            const response = await apiAuth.get('user/getUserMainInfo');

            if (response && response.data.main && response.data.address){
                mainUserInfo.value = response.data.main;
                userAddressInfo.value = response.data.address;
            }
        } catch (e: any) {
            error.value = "Произошла ошибка при получении информации о пользователе, попробуйте позже";
            console.error(e);
        } finally {
            pending.value = false;
        }
    }

    const wallpaperPending = ref<boolean>(false);
    const wallpaperError = ref<string | null>(null);
    const userWallpaper = ref<string>();

    const setUserWallpaper = async (img: (string | ArrayBuffer)[]) => {
        wallpaperPending.value = true;
        wallpaperError.value = null;

        try {
            const response = await apiAuth.post('user/setWallpaper', {
                imgBlob: img
            });

            if (response && response.data){
                userWallpaper.value = response.data;
            }
        } catch (e: any) {
            wallpaperError.value = "Произошла ошибка при изменении wallpaper, попробуйте позже";
            console.error(e);
        } finally {
            wallpaperPending.value = false;
        }
    }

    return{
        pending,
        error,
        getMainUserInfo,
        mainUserInfo,
        userAddressInfo,

        wallpaperPending,
        wallpaperError,
        userWallpaper,
        setUserWallpaper
    }
})