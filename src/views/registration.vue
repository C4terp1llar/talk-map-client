<script setup lang="ts">
import {useRegistrationStore} from "@/stores/regSteps";
import EmailStep from "@/components/registerSteps/EmailStep.vue";
import CodeStep from "@/components/registerSteps/CodeStep.vue";
import PassStep from "@/components/registerSteps/PassStep.vue";
import {computed} from "vue";
import PersonalStep from "@/components/registerSteps/PersonalStep.vue";
import AddressStep from "@/components/registerSteps/AddressStep.vue";
import AvatarStep from "@/components/registerSteps/avatarStep.vue";

const regStore = useRegistrationStore();

const steps = {
  1: EmailStep,
  2: CodeStep,
  3: PassStep,
  4: PersonalStep,
  5: AddressStep,
  6: AvatarStep
}

const currentComponent = computed(() => steps[regStore.currentStep]);

const currentProgress = computed(() =>  (regStore.currentStep / Object.keys(steps).length) * 100);

</script>

<template>
  <div class="wrapper-page-main-content">

    <v-progress-linear
        v-model="currentProgress"
        height="5"
        color="green"
        class="progress-bar-reg"
    />


      <component :is="currentComponent" v-bind="currentComponent === AddressStep ? {regMode: true} : {}" />



    <router-link class="align-self-center mt-4" to="login">Уже есть аккаунт?</router-link>

  </div>
</template>

<style scoped>
.progress-bar-reg{
  position: absolute;
  border-radius: 15px;
  width: 100%;
}
</style>