import {defineStore} from "pinia";
import {ref} from "vue";
import apiAuth from "@/utils/apiAuth";
import type {ExternalUserInfoAddress, ExternalUserInfoMain} from "@/helpers/interfaces";

export const useExternalUserStore = defineStore('externalUser', () => {
    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);

    const main = ref<ExternalUserInfoMain | null>(null);
    const address = ref<ExternalUserInfoAddress | null>(null);

    const existFlag = ref<boolean>(false);

    const isUserExist = async (searchUid: string) => {
        pending.value = true;
        error.value = null;
        existFlag.value = false;
        try {
            const response = await apiAuth.post('user/isUserExist', {
                uid: searchUid
            });

            if (response.data && response.status === 200){
                existFlag.value = response.data.isExist;
            }
        } catch (e: any) {
            error.value = "Произошла ошибка при получении информации о стороннем пользователе, попробуйте позже";
            console.error(e);
        } finally {
            pending.value = false;
        }
    }

    const getExternalMainUserInfo = async (searchUid: string) => {
        pending.value = true;
        error.value = null;
        main.value = null
        address.value = null

        try {
            const response = await apiAuth.post('user/getExternalUserMainInfo', {
                uid: searchUid
            });

            if (response.data && response.data.main && response.data.address && response.status === 200){
                main.value = response.data.main;
                address.value = response.data.address;
            }
        } catch (e: any) {
            error.value = "Произошла ошибка при получении информации о стороннем пользователе, попробуйте позже";
            console.error(e);
        } finally {
            pending.value = false;
        }
    }

    return{
        pending,
        error,
        main,
        address,
        getExternalMainUserInfo,
        existFlag,
        isUserExist,
    }
})