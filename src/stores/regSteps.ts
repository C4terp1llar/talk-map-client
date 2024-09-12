import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
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
        }catch (e) {
            error.value = "Произошла ошибка, попробуйте позже";
            console.error(e);
        }finally {
            pending.value = false;
        }
    }

    const guessCities = ref<{ name: string; lat: number; lon: number }[]>([]);

    const getAddresses = async (clientAddress: string) => {
        pending.value = true;
        error.value = null;

        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: clientAddress,
                    format: 'json'
                }
            });

            console.log(response.data);

            guessCities.value = response.data.map((item: any) => ({
                name: item.display_name,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon)
            }));

            console.log(guessCities.value);
        } catch (e) {
            error.value = "Произошла ошибка, попробуйте позже";
            console.error(e);
        } finally {
            pending.value = false;
        }
    };

    return {
        pending,
        error,
        currentStep,
        nextStep,
        prevStep,
        isEmailBusy,
        newUserEmail,
        sendConfirmEmailCode,
        checkConfirmEmailCode,
        resetSteps,
        guessCities,
        getAddresses
    };
});
