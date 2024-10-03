import {defineStore} from "pinia";
import {ref} from "vue";
import apiAuth from "@/utils/apiAuth";
import type {Address} from "@/helpers/interfaces";

interface MainUserInfo {
    email: string;
    nickname: string;
    b_date: string;
    gender: 'male' | 'female';
    avatar: string;
    wallpaper: string | null;
}


export const useUserStore = defineStore('user', () => {
    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);

    const mainUserInfo = ref< MainUserInfo | null>(null)
    const userAddressInfo = ref< Address | null>(null)

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
    const userWallpaper = ref<string | null>(null);

    const setUserWallpaper = async (newImg: string | ArrayBuffer, oldImg: string | ArrayBuffer, force: string) => {
        wallpaperPending.value = true;
        wallpaperError.value = null;

        try {
            let response;
            if (force === 'uploadCrop'){
                response = await apiAuth.post('user/setWallpaper', {
                    croppedImg: newImg,
                    originalImg: oldImg,
                    force: force
                });
            }else{
                response = await apiAuth.post('user/setWallpaper', {
                    croppedImg: newImg,
                    force: force
                });
            }

            if (response && response.data){
                userWallpaper.value = response.data;
            }
        } catch (e: any) {
            wallpaperError.value = "Произошла ошибка при изменении обоев, попробуйте позже";
            console.error(e);
        } finally {
            wallpaperPending.value = false;
        }
    }

    const avatarPending = ref<boolean>(false);
    const avatarError = ref<string | null>(null);
    const userAvatar = ref<string>();

    const setUserAvatar = async (newImg: string | ArrayBuffer, oldImg: string | ArrayBuffer, force: string) => {
        avatarPending.value = true;
        avatarError.value = null;

        try {

            let response;
            if (force === 'uploadCrop'){
                response = await apiAuth.post('user/setAvatar', {
                    croppedImg: newImg,
                    originalImg: oldImg,
                    force: force
                });
            }else{
                response = await apiAuth.post('user/setAvatar', {
                    croppedImg: newImg,
                    force: force
                });
            }

            if (response && response.data){
                userAvatar.value = response.data;
            }
        } catch (e: any) {
            avatarError.value = "Произошла ошибка при изменении аватара, попробуйте позже";
            console.error(e);
        } finally {
            avatarPending.value = false;
        }
    }

    const originalPending = ref<boolean>(false);
    const originalError = ref<string | null>(null);

    const getOriginalImg = async (currentResource: 'getOriginalAvatar' | 'getOriginalWallpaper') => {
        originalPending.value = true;
        originalError.value = null;

        try {
            const response = await apiAuth.post(`user/${currentResource}`)

            if (response && response.data){
                return response.data
            }
        } catch (e: any) {
            originalError.value = "Произошла ошибка при получении картинки в полном разрешении для редактирования, попробуйте позже";
            console.error(e);
        } finally {
            originalPending.value = false;
        }
    }

    const deleteUserWallpaper = async () => {
        wallpaperPending.value = true;
        wallpaperError.value = null;

        try {
            const response = await apiAuth.post('user/deleteWallpaper')

            if (response.status === 200){
                userWallpaper.value = null;

                if (mainUserInfo.value) {
                    mainUserInfo.value.wallpaper = null;
                }
            }
        } catch (e: any) {
            wallpaperError.value = "Произошла ошибка при удалении обоев, попробуйте позже";
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
        setUserWallpaper,

        avatarPending,
        avatarError,
        userAvatar,
        setUserAvatar,

        originalPending,
        originalError,
        getOriginalImg,

        deleteUserWallpaper
    }
})