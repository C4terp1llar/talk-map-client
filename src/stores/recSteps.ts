import {defineStore} from "pinia";
import {ref} from "vue";

export const useRecoveryStore = defineStore('recovery', () => {

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


    const recoveryUserEmail = ref<string>('')

    return{
        currentStep,

        nextStep,
        prevStep,
        resetSteps,

        recoveryUserEmail
    }

})