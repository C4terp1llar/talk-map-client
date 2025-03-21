import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from "@/utils/api";
import {getDeviceInfo} from "@/helpers/deviceInfo";
import apiAuth from "@/utils/apiAuth";
import {useRouter} from "vue-router";

export const useAuthStore = defineStore('auth', () => {
    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);

    const router = useRouter();

    const changeUserPassword = async (clientEmail: string, newClientPassword: string) => {
        pending.value = true;
        error.value = null;

        try {
            const response = await api.post(`reg/changePassword`, {
                email: clientEmail,
                password: newClientPassword
            });

            if (response.data && response.data.passChangeNeed){
                return response.data.passChangeNeed
            }

        } catch (e: any) {
            error.value = "Произошла ошибка, попробуйте позже"
            console.error(e);
        } finally {
            pending.value = false;
        }
    }

    const login = async (clientEmail: string, clientPassword: string) => {
        pending.value = true;
        error.value = null;

        try {
            const currentUserDeviceInfo = localStorage.getItem('device_info') || getDeviceInfo();

            const response = await api.post(`auth/login`, {
                email: clientEmail,
                password: clientPassword,
                device_info: currentUserDeviceInfo
            }, { withCredentials: true });

            if (response.data && response.data.accessToken) {
                localStorage.setItem('access_token', response.data.accessToken);
                localStorage.setItem('device_info', currentUserDeviceInfo);
            }

            return response.data.nickname
        }catch (e: any) {
            if (e.response && e.response.status === 400){
                error.value = e.response.data.message || e.response.data.error;
            }else{
                error.value = "Произошла ошибка при авторизации, попробуйте позже"
            }
            console.error(e);
        }finally {
            pending.value = false;
        }
    }

    const logout = async () => {
        pending.value = true;
        error.value = null;

        try {
            await apiAuth.get('auth/logout', { withCredentials: true });
            localStorage.removeItem('access_token');
            localStorage.removeItem('device_info')
            await router.push('/login');
        } catch (e: any) {
            error.value = "Произошла ошибка при выходе, попробуйте позже";
            console.error(e);
        } finally {
            pending.value = false;
        }
    }

    const getSession = async (id: string) => {
        try {
            const response = await apiAuth.get(`user/sessions/${id}`, { withCredentials: true });
            if (response.status === 200 && response.data) {
                return response.data.match;
            }
        } catch (e: any) {
            console.error(e);
        }
    };

    return {
        pending,
        error,
        changeUserPassword,
        login,
        logout,
        getSession
    };
});