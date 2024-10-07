import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from "@/utils/api";
import {getDeviceInfo} from "@/helpers/deviceInfo";
import type {Address} from "@/helpers/interfaces";

export const useRegistrationStore = defineStore('registration', () => {
    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);

    const currentStep = ref<number>(1);

    const nextStep = () => {
        currentStep.value++;
    };
    const prevStep = () => {
        currentStep.value--;
    };
    const resetSteps = () => {
        currentStep.value = 1;
    };


    const newUserEmail = ref<string>('')

    const isEmailBusy = async (clientMail: string) => {
        pending.value = true;
        error.value = null;

        try{
            const response = await api.post('reg/checkEmail', {
                email: clientMail
            })

            if (response.data){
                return response.data.isTaken
            }
        }catch (e) {
            error.value = "Произошла ошибка, попробуйте позже";
            console.error(e);
        }finally {
            pending.value = false;
        }
    }

    const sendConfirmEmailCode = async (clientEmail: string, type: 'recovery' | 'registration') => {
        pending.value = true;
        error.value = null;

        try {
            await api.post(`reg/sendCheckCode`, {
                email: clientEmail,
                type: type
            }, { withCredentials: true });
        }catch (e) {
            error.value = "Произошла ошибка, попробуйте позже";
            console.error(e);
        }finally {
            pending.value = false;
        }
    }

    const checkConfirmEmailCode = async (clientCode: string) => {
        pending.value = true;
        error.value = null;

        try {
            const response = await api.post(`reg/verifyCheckCode`, {
                code: clientCode,
            }, { withCredentials: true });

            if (response.data.message === "Неверный код"){
                error.value = "Неверный код"
            }
        }catch (e: any) {
            e.response.data.message === "Неверный код" ? error.value = "Неверный код" : error.value = "Произошла ошибка, попробуйте позже"
            console.error(e);
        }finally {
            pending.value = false;
        }
    }

    const newUserPassword = ref<string>('')

    const setNewUserPassword = (clientPassword: string) => {
        newUserPassword.value = clientPassword
    }

    const isNicknameTaken = ref<string>('');
    const nicknamePending= ref<boolean>(false);

    const checkNicknameAvailable = async (clientNickname: string) => {
        nicknamePending.value = true;
        error.value = null;

        try {
            const response = await api.post(`reg/checkNickname`, {
                nickname: clientNickname
            });

            if (response.data && response.status === 200){
                isNicknameTaken.value = `${response.data.isTaken}`

                return response.data.isTaken
            }
        }catch (e) {
            error.value = "Произошла ошибка попробуйте позже";
            console.error(e);
        }finally {
            nicknamePending.value = false;
        }
    };

    const newUserNickname = ref<string>('')
    const newUserDateB = ref<string>('')
    const newUserGender = ref<string>('')

    const setNewUserPersonal = (clientUserNickname: string, clientUserDateB: string, clientUserGender: string) => {
        newUserNickname.value = clientUserNickname
        newUserDateB.value = clientUserDateB
        newUserGender.value = clientUserGender
    }


    const guessCities = ref<Address[]>([]);
    const newUserAddress = ref<Address | null>(null)

    const setNewUserAddress = (clientAddress: Address) => {
        newUserAddress.value = clientAddress;
        guessCities.value = []
    }

    const addressPending= ref<boolean>(false);

    const getAddresses = async (clientAddressQuery: string) => {
        addressPending.value = true;
        error.value = null;

        try {
            const response = await api.post('reg/getCitiesByQ', {
                query: clientAddressQuery,
                filter: 'buildings'
            });

            if (response.data.message){
                return response.data.message;
            }else{
                guessCities.value = response.data
            }
        } catch (e) {
            error.value = "Произошла ошибка при поиске адреса, попробуйте позже";
            console.error(e);
        } finally {
            addressPending.value = false;
        }
    };

    const newUserAvatar = ref<string>('')

    const setNewUserAvatar = (clientAvatar: string) => {
        newUserAvatar.value = clientAvatar
    }

    //todo финальный для рега по всем данным

    const regNewUser = async (originalImg: string | ArrayBuffer) => {
        //!email || !password || !nickname || !date_b || !gender || !avatar || !address || !device_info

        pending.value = true;
        error.value = null;

        try{
            const response = await api.post('reg/registerUser', {
                email: newUserEmail.value,
                password: newUserPassword.value,
                nickname: newUserNickname.value,
                date_b: newUserDateB.value,
                gender: newUserGender.value,
                avatar: newUserAvatar.value,
                originalAvatar: originalImg,
                address: newUserAddress.value,
                device_info: getDeviceInfo()
            }, { withCredentials: true });

            if (response.data && response.data.accessToken) {
                localStorage.setItem('access_token', response.data.accessToken);
            }

        }catch (e) {
            error.value = "Произошла ошибка, попробуйте позже";
            console.error(e);
        }finally {
            pending.value = false;
        }

    }

    const clearAllData = () => {
        newUserEmail.value = ''
        newUserPassword.value = ''
        newUserNickname.value = ''
        newUserDateB.value = ''
        newUserGender.value = ''
        newUserAvatar.value = ''
        newUserAddress.value = null
    }

    return {
        pending,
        error,
        currentStep,
        nextStep,
        prevStep,
        resetSteps,

        isEmailBusy,
        newUserEmail,

        sendConfirmEmailCode,
        checkConfirmEmailCode,

        newUserPassword,
        setNewUserPassword,

        isNicknameTaken,
        nicknamePending,
        checkNicknameAvailable,

        newUserNickname,
        newUserDateB,
        newUserGender,
        setNewUserPersonal,

        newUserAddress,
        setNewUserAddress,

        guessCities,
        addressPending,
        getAddresses,

        newUserAvatar,
        setNewUserAvatar,

        regNewUser,

        clearAllData
    };
});
