import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from "@/utils/api";

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


    const newUserEmail = ref<string>()

    const isEmailBusy = async (clientMail: string) => {
        pending.value = true;
        error.value = null;

        try{
            const response = await api.post('checkEmail', {
                email: clientMail
            })

            if (response.data.isTaken){
                error.value = "Данный email уже используется"
            }else{
                newUserEmail.value = clientMail;
            }
        }catch (e) {
            error.value = "Произошла ошибка, попробуйте позже";
            console.error(e);
        }finally {
            pending.value = false;
        }
    }

    const sendConfirmEmailCode = async (clientEmail: string) => {
        pending.value = true;
        error.value = null;

        try {
            await api.post(`sendCheckCode`, {
                email: clientEmail,
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
            const response = await api.post(`verifyCheckCode`, {
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

    const newUserPassword = ref<string>()

    const setNewUserPassword = (clientPassword: string) => {
        newUserPassword.value = clientPassword
    }

    const newUserNickname = ref<string>()
    const newUserDateB = ref<string>()
    const newUserGender = ref<string>()

    const setNewUserPersonal = (clientUserNickname: string, clientUserDateB: string, clientUserGender: string) => {
        newUserNickname.value = clientUserNickname
        newUserDateB.value = clientUserDateB
        newUserGender.value = clientUserGender
    }




    const guessCities = ref<{ name: string; lat: number; lon: number }[]>([]);

    const newUserAddress = ref<{ name: string; lat: number; lon: number }>()

    const setNewUserAddress = (clientAddress: { name: string; lat: number; lon: number }) => {
        newUserAddress.value = clientAddress
    }

    const getAddresses = async (clientAddress: string) => {
        pending.value = true;
        error.value = null;

        try {
            const response = await api.post('getCitiesByQ', {
                query: clientAddress
            });


            if (response.data.message){
                error.value = response.data.message;
            }else{
                guessCities.value = response.data
            }

            console.log(guessCities.value);
        } catch (e) {
            error.value = "Произошла ошибка, попробуйте позже";
            console.error(e);
        } finally {
            pending.value = false;
        }
    };

    const newUserAvatar = ref<string>()

    const setNewUserAvatar = (clientAvatar: string) => {
        newUserAvatar.value = clientAvatar
    }

    //todo финальный для рега по всем данным

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

        newUserNickname,
        newUserDateB,
        newUserGender,
        setNewUserPersonal,

        newUserAddress,
        setNewUserAddress,

        guessCities,
        getAddresses,

        newUserAvatar,
        setNewUserAvatar,
    };
});
