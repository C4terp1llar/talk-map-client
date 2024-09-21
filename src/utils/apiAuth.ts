import axios, { type AxiosInstance } from 'axios';
import {refreshToken} from "@/stores/sync";
import {setPendingEnd, setPendingStart} from "@/utils/refreshStore";


const apiAuth: AxiosInstance = axios.create({
    // 'https://talkmapserver-production.up.railway.app/api/'
    // 'http://localhost:5000/api/'
    baseURL: 'https://talkmapserver-production.up.railway.app/api/'
});

apiAuth.interceptors.request.use((config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`
    return config;
}))

//  перехватчики ответов
apiAuth.interceptors.response.use(
    response => response,
    async error => {
        const { config, response } = error;
        if (response?.status === 401) {
            try {
                const newAccessToken = await refreshToken();
                config.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiAuth(config);
            } catch (e) {
                return Promise.reject(e);
            }
        }
        return Promise.reject(error);
    }
);

export default apiAuth;