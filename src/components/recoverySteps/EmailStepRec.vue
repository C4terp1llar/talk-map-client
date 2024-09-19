<script setup lang="ts">

import {rules} from "@/helpers/baseTextValidator";
import {onMounted, ref} from "vue";
import {useRegistrationStore} from "@/stores/regSteps";
import {useNotificationStore} from "@/stores/notifications";
import {replaceSymbols} from "@/helpers/replaceSymbols";
import {useRouter} from "vue-router";
import {useRecoveryStore} from "@/stores/recSteps";

onMounted(() => {
  email.value = recStore.recoveryUserEmail
})

const router = useRouter()

const notificationStore = useNotificationStore()

const recStore = useRecoveryStore();
const regStore = useRegistrationStore()

const email = ref<string>('');

const handleSubmit = async () => {
  if (rules.email(email.value) !== true) return

  const isTaken = await regStore.isEmailBusy(email.value)

  if (!isTaken){
    notificationStore.addNotification('warning', 'Учетной записи с таким email не существует', 3000)
  }else if (isTaken){
    recStore.recoveryUserEmail = email.value;
    await sendCode()
  }else if (regStore.error){
    notificationStore.addNotification('error', regStore.error, 3000)
  }
}

const sendCode = async () => {
  await regStore.sendConfirmEmailCode(email.value, 'recovery')

  if (!regStore.error) {
    recStore.nextStep();
  } else {
    notificationStore.addNotification('error', regStore.error, 3000)
  }
}
</script>

<template>
  <v-form @submit.prevent="handleSubmit" class="w-100 d-flex flex-column gap-3">


    <div class="field">
      <label class="inp-default-label">Email:</label>
      <v-text-field
          v-model="email"
          :rules="[rules.required,rules.fieldSymbols(email), rules.email]"
          class="w-100"
          variant="outlined"
          type="email"
          maxlength="50"
          hide-details="auto"
          @input="email = replaceSymbols(email)"
      />
    </div>

    <div class="d-flex flex-column gap-1">
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

      <v-btn
          class="text-none flex-1-0"
          variant="plain"
          @click="router.push('/')"
          :disabled="regStore.pending"
          color="green"
      >
        Вернуться к авторизации
      </v-btn>
    </div>

  </v-form>
</template>

<style scoped>

</style>