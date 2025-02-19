import {defineStore} from "pinia";
import {ref} from "vue";
import apiAuth from "@/utils/apiAuth";
import type {Address, MainUserInfo, SearchFoundFriend, SearchFriendFilter} from "@/helpers/interfaces";


export const useUserStore = defineStore('user', () => {
    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);

    const mainUserInfo = ref< MainUserInfo | null>(null)
    const userAddressInfo = ref< Address | null>(null)

    const rsAmount = ref<number | null>(null);

    const getMainUserInfo = async () => {
        pending.value = true;
        error.value = null;

        mainUserInfo.value = null
        userAddressInfo.value = null

        try {
            const response = await apiAuth.get('user/getUserMainInfo');

            if (response.status === 200 && response.data) {
                mainUserInfo.value = response.data.main;
                userAddressInfo.value = response.data.address;
                rsAmount.value = response.data.rsAmount;
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

    const addressPending = ref<boolean>(false);
    const addressError = ref<string | null>(null);

    const changeUserAddress = async (newAddress: Address) => {
        addressPending.value = true;
        addressError.value = null;

        try {
            const response = await apiAuth.post('user/changeAddress',{
                address: newAddress
            })

            if (response.data && response.data.address){
                userAddressInfo.value = response.data.address
            }
        } catch (e: any) {
            addressError.value = "Произошла ошибка при изменении адреса, попробуйте позже";
            console.error(e);
        } finally {
            addressPending.value = false;
        }
    }

    const newTagText = ref<string>('')
    const newTagEmoji = ref<string>('')

    const tagPending = ref<boolean>(false);
    const tagError = ref<string | null>(null);

    const setUserTag = async () => {
        if (!newTagText.value || !newTagEmoji.value) return;
        tagPending.value = true;
        tagError.value = null;

        try {
            const response = await apiAuth.post('user/setTag',{
                text: newTagText.value,
                emoji: newTagEmoji.value
            })

            if (response.status === 200 && mainUserInfo.value){
                mainUserInfo.value.tags = response.data.tagsArr;
            }
        } catch (e: any) {
            tagError.value = "Произошла ошибка при добавлении тега, попробуйте позже";
            console.error(e);
        } finally {
            tagPending.value = false;
        }
    }

    const tagDeletePending = ref<boolean>(false);
    const tagDeleteError = ref<string | null>(null);

    const deleteUserTag = async (deleteTagText: string) => {
        tagDeletePending.value = true;
        tagDeleteError.value = null;

        try {
            const response = await apiAuth.post('user/deleteTag',{
                deleteTagText: deleteTagText
            })

            if (response.status === 200 && mainUserInfo.value){
                mainUserInfo.value.tags = response.data.tagsArr;
            }
        } catch (e: any) {
            tagDeleteError.value = "Произошла ошибка при удалении тега, попробуйте позже";
            console.error(e);
        } finally {
            tagDeletePending.value = false;
        }
    }


    const findUserPending = ref<boolean>(false);
    const findUserError = ref<string | null>(null);

    const foundUsers = ref<SearchFoundFriend[] | null>(null);

    const currentPage = ref<number>(1);
    const usersPerPage = ref<number>(10);

    const loadMoreUsersFlag = ref<boolean>(false)

    const hasMoreFlag = ref<boolean | null>(null);
    const wasGlobalFlag = ref<boolean | null>(null);

    const findUsers = async (filter: SearchFriendFilter, mode: 'load' | 'load-more', limit?: number, requester?: string) => {

        let currentPending = mode === 'load' ? findUserPending : loadMoreUsersFlag;

        if (mode === 'load-more') {
            currentPage.value += 1;
            hasMoreFlag.value = null;
        }else{
            currentPage.value = 1;
        }


        currentPending.value = true;
        wasGlobalFlag.value = null;
        findUserError.value = null;

        try {
            const response = await apiAuth.post('user/findUsers', {
                ...filter,
                page: currentPage.value,
                limit: limit || usersPerPage.value,
                requester
            });

            if (response && response.data.users) {
                hasMoreFlag.value = response.data.hasMore;
                wasGlobalFlag.value = response.data.wasGlobal;

                if (currentPage.value === 1) {
                    foundUsers.value = response.data.users;
                } else if (currentPage.value !== 1 && foundUsers.value){
                    foundUsers.value.push(...response.data.users);
                }
            }
        } catch (e: any) {
            findUserError.value = "Произошла ошибка при поиске пользователей, попробуйте позже";
            console.error(e);
        } finally {
            currentPending.value = false;
        }
    };


    return{
        pending,
        error,
        getMainUserInfo,
        mainUserInfo,
        userAddressInfo,
        rsAmount,

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

        addressPending,
        addressError,
        changeUserAddress,

        newTagText,
        newTagEmoji,
        tagPending,
        tagError,
        setUserTag,

        tagDeletePending,
        tagDeleteError,
        deleteUserTag,

        findUserPending,
        findUserError,
        findUsers,
        foundUsers,

        currentPage,
        usersPerPage,
        loadMoreUsersFlag,
        hasMoreFlag,
        wasGlobalFlag
    }
})