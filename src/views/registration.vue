<script setup lang="ts">
import {useRegistrationStore} from "@/stores/regSteps";
import EmailStep from "@/components/registerSteps/EmailStep.vue";
import CodeStep from "@/components/registerSteps/CodeStep.vue";
import PassStep from "@/components/registerSteps/PassStep.vue";
import {computed} from "vue";
import PersonalStep from "@/components/registerSteps/PersonalStep.vue";
import AddressStep from "@/components/registerSteps/AddressStep.vue";

const regStore = useRegistrationStore();

const steps = {
  1: EmailStep,
  2: CodeStep,
  3: PassStep,
  4: PersonalStep,
  5: AddressStep
}

const currentComponent = computed(() => steps[regStore.currentStep]);

const currentProgress = computed(() =>  (regStore.currentStep / Object.keys(steps).length) * 100);

</script>

<template>
  <div class="wrapper">

<!--    <v-progress-linear-->
<!--        v-model="currentProgress"-->
<!--        height="5"-->
<!--        color="primary"-->
<!--    />-->


      <component :is="currentComponent"/>



    <router-link class="align-self-center mt-4" to="login">Уже есть аккаунт?</router-link>

  </div>
</template>

<style scoped>
.wrapper {
  max-width: 500px;
  min-width: 300px;
  height: auto;
  padding: 50px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 525px) {
    padding: 15px;
    max-width: 400px;
  }
  @media screen and (max-width: 425px) {
  padding: 15px 5px;
    max-width: 350px;
    width: 100%;
  }
}
</style>