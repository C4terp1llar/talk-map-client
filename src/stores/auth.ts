import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from "@/utils/api";
import {getDeviceInfo} from "@/helpers/deviceInfo";

export const useAuthStore = defineStore('auth', () => {
    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);

    const login = async (clientEmail: string, clientPassword: string) => {
        pending.value = true;
        error.value = null;

        try {
            const response = await api.post(`auth/login`, {
                email: clientEmail,
                password: clientPassword,
                device_info: getDeviceInfo()
            }, { withCredentials: true });

            if (response.data && response.data.accessToken) {
                localStorage.setItem('access_token', response.data.accessToken);
            }

            return response.data.nickname
        }catch (e: any) {
            if (e.response && e.response.status === 400){
                error.value = e.response.data.message || e.response.data.error;
            }else{
                error.value = "Произошла ошибка, попробуйте позже"
            }
            console.error(e);
        }finally {
            pending.value = false;
        }
    }

    return {
        pending,
        error,
        login
    };
});