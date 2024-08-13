<script setup lang="ts">

import {rules} from "@/helpers/baseTextValidator";
import {ref} from "vue";
import {useRegistrationStore} from "@/stores/regSteps";

const regStore = useRegistrationStore();

const email = ref<string>('');

const handleSubmit = () => {
  regStore.nextStep()
}
</script>

<template>
  <v-form @submit.prevent="handleSubmit" class="w-100 d-flex flex-column gap-3">


    <div class="field">
      <label class="inp-default-label" >Email:</label>
      <v-text-field
          v-model="email"
          :rules="[rules.required, rules.email]"
          class="w-100"
          variant="outlined"
          type="email"
          maxlength="50"
          hide-details="auto"
      />
    </div>



      <v-btn
          class="text-none flex-1-0"
          type="submit"
          variant="outlined"
      >
        Далее
      </v-btn>


  </v-form>
</template>

<style scoped>

</style>