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
    nickname_color?: string | null;
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

            if (response.status === 200 && mainUserInfo.value){
                userWallpaper.value = null;
                mainUserInfo.value.wallpaper = null;
            }
        } catch (e: any) {
            wallpaperError.value = "Произошла ошибка при удалении обоев, попробуйте позже";
            console.error(e);
        } finally {
            wallpaperPending.value = false;
        }
    }

    const nicknamePending = ref<boolean>(false);
    const nicknameError = ref<string | null>(null);

    const changeUserNickname = async (newNickname: string) => {
        nicknamePending.value = true;
        nicknameError.value = null;

        try {
            const response = await apiAuth.post('user/changeNickname',{
                nickname: newNickname
            })

            if (response.status === 200 && mainUserInfo.value){
                mainUserInfo.value.nickname = newNickname;
            }
        } catch (e: any) {
            nicknameError.value = "Произошла ошибка при изменении никнейма, попробуйте позже";
            console.error(e);
        } finally {
            nicknamePending.value = false;
        }
    }

    const nicknameColorPending = ref<boolean>(false);
    const nicknameColorError = ref<string | null>(null);

    const changeUserNicknameColor = async (newColor: string) => {
        nicknameColorPending.value = true;
        nicknameColorError.value = null;

        try {
            const response = await apiAuth.post('user/changeNicknameColor',{
                color: newColor
            })

            if (response.status === 200 && mainUserInfo.value){
                newColor === 'default' ? mainUserInfo.value.nickname_color = null : mainUserInfo.value.nickname_color = newColor;
            }
        } catch (e: any) {
            nicknameColorError.value = "Произошла ошибка при изменении цвета никнейма, попробуйте позже";
            console.error(e);
        } finally {
            nicknameColorPending.value = false;
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

        deleteUserWallpaper,

        nicknamePending,
        nicknameError,
        changeUserNickname,

        nicknameColorPending,
        nicknameColorError,
        changeUserNicknameColor,
    }
})