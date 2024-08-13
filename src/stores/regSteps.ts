import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

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
        resetSteps,
        guessCities,
        getAddresses
    };
});
