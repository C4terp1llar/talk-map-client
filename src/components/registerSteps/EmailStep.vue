<script setup lang="ts">

import {rules} from "@/helpers/baseTextValidator";
import {ref} from "vue";
import {useRegistrationStore} from "@/stores/regSteps";
import {useNotificationStore} from "@/stores/notifications";

const notificationStore = useNotificationStore()
const regStore = useRegistrationStore();

const email = ref<string>('');

const handleSubmit = async () => {
  if (rules.email(email.value) !== true) return

  await regStore.isEmailBusy(email.value)

  if(!regStore.error){
    await sendCode()
  }else {
    notificationStore.addNotification('error', regStore.error, 3000)
  }
}

const sendCode = async () => {
  await regStore.sendConfirmEmailCode(email.value)

  if(!regStore.error){
    regStore.nextStep();
  }else {
    notificationStore.addNotification('error', regStore.error, 3000)
  }
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
        <template v-if="regStore.pending">
          <v-progress-circular
              class="align-self-center"
              color="green"
              indeterminate
              size="small"
              :disabled="regStore.pending"
          ></v-progress-circular>
        </template>
        <template v-else>
          Далее
        </template>
      </v-btn>


  </v-form>
</template>

<style scoped>

</style>