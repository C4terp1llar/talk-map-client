import apiAuth from "@/utils/apiAuth";
import {useRouter} from "vue-router";

const router = useRouter()

const checkTokenValidity = async () => {
    try {
        await apiAuth.get('auth/sync');
        return true;
    } catch (error: any) {
        return false;
    }
};

const refreshToken = async () => {
    try {
        const {data: {accessToken}} = await apiAuth.post('auth/refresh', {}, {withCredentials: true});
        localStorage.setItem('access_token', accessToken);
        return accessToken;
    } catch (e) {
        localStorage.removeItem('access_token');
        await router.push({name: 'login'});
        console.error("Ошибка при обновлении токена", e);
        throw e;
    }
};

export {
    checkTokenValidity,
    refreshToken,
}

