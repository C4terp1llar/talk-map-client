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

    const isOutgoing = ref<boolean | null>(null);
    const isIncoming = ref<boolean | null>(null);

    const getExternalMainUserInfo = async (searchUid: string) => {
        pending.value = true;
        error.value = null;
        main.value = null
        address.value = null

        isOutgoing.value = null;
        isIncoming.value = null;
        try {
            const response = await apiAuth.post('user/getExternalUserMainInfo', {
                uid: searchUid
            });

            if (response.data && response.data.main && response.data.address && response.status === 200){
                main.value = response.data.main;
                address.value = response.data.address;
                isOutgoing.value = response.data.isOutgoing;
                isIncoming.value = response.data.isIncoming;
            }
        } catch (e: any) {
            error.value = "Произошла ошибка при получении информации о стороннем пользователе, попробуйте позже";
            console.error(e);
        } finally {
            pending.value = false;
        }
    }

    const friendReqPending = ref<boolean>(false);
    const friendReqError = ref<string | null>(null);

    const sendFriendRequest = async (recipient: string) => {
        friendReqPending.value = true;
        friendReqError.value = null;

        try {
            await apiAuth.post('user/sendFriendRequest', {
                recipient_id: recipient
            });
        } catch (e: any) {
            friendReqError.value = "Произошла ошибка при отправке заявки, попробуйте позже";
            console.error(e);
        } finally {
            friendReqPending.value = false;
        }
    }

    const cancelFriendRequest = async (recipient: string) => {
        friendReqPending.value = true;
        friendReqError.value = null;

        try {
            await apiAuth.post('user/cancelFriendRequest', {
                recipient_id: recipient
            });
        } catch (e: any) {
            friendReqError.value = "Произошла ошибка при отмене заявки, попробуйте позже";
            console.error(e);
        } finally {
            friendReqPending.value = false;
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
        isOutgoing,
        isIncoming,
        friendReqPending,
        friendReqError,
        sendFriendRequest,
        cancelFriendRequest
    }
})