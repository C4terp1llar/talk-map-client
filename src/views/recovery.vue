<script setup lang="ts">
import {computed} from "vue";
import EmailStepRec from "@/components/recoverySteps/EmailStepRec.vue";
import CodeStepRec from "@/components/recoverySteps/CodeStepRec.vue";
import PassStepRec from "@/components/recoverySteps/PassStepRec.vue";
import {useRecoveryStore} from "@/stores/recSteps";

const recStore = useRecoveryStore()

const steps = {
  1: EmailStepRec,
  2: CodeStepRec,
  3: PassStepRec
}

const currentComponent = computed(() => steps[recStore.currentStep]);

const currentProgress = computed(() =>  (recStore.currentStep / Object.keys(steps).length) * 100);

</script>

<template>
  <div class="wrapper-page-main-content">

    <v-progress-linear
        v-model="currentProgress"
        height="5"
        color="green"
        class="progress-bar-reg"
    />


    <component :is="currentComponent"/>



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