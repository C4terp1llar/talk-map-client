import {defineStore} from "pinia";
import {ref} from "vue";
import apiAuth from "@/utils/apiAuth";

interface MainUserInfo {
    email: string;
    nickname: string;
    b_date: string;
    gender: 'male' | 'female';
    avatar: string;
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
            const response = await apiAuth.get('user/getUserMainInfo', { withCredentials: true });

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

    return{
        pending,
        error,
        getMainUserInfo,
        mainUserInfo,
        userAddressInfo
    }
})