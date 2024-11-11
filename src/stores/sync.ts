import apiAuth from "@/utils/apiAuth";

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
        const {data: {accessToken}} = await apiAuth.get('auth/refresh', {withCredentials: true});
        localStorage.setItem('access_token', accessToken);
        return accessToken;
    } catch (e) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('device_info')
        console.error("Ошибка при обновлении токена", e);
        throw e;
    }
};

export {
    checkTokenValidity,
    refreshToken,
}

