import apiAuth from "@/utils/apiAuth";

export const checkTokenValidity = async () => {
    try {
        await apiAuth.get('auth/sync');
        return true;
    } catch (error) {
        return false;
    }
};