<script setup lang="ts">

import {rules} from "@/helpers/baseTextValidator";
import {ref} from "vue";
import {useRegistrationStore} from "@/stores/regSteps";
import {useNotificationStore} from "@/stores/notifications";

const notificationStore = useNotificationStore()
const regStore = useRegistrationStore();

const code = ref<string>('');

const handleSubmit = async () => {
  await regStore.checkConfirmEmailCode(code.value)

  if(!regStore.error){
    regStore.nextStep()
  }else{
    notificationStore.addNotification('error', regStore.error, 3000)
  }
}
</script>

<template>
  <v-form @submit.prevent="handleSubmit" class="w-100 d-flex flex-column gap-3">

    <div class="field">
      <label class="inp-default-label" >Код подтверждения:</label>
      <v-text-field
          v-model="code"
          :rules="[rules.required]"
          class="w-100"
          variant="outlined"
          maxlength="4"
          hide-details="auto"
      />
    </div>

    <div class="d-flex gap-3">
      <v-btn
          class="text-none flex-1-0"
          variant="outlined"
          @click="regStore.prevStep()"
          :disabled="regStore.pending"
      >
        Назад
      </v-btn>

      <v-btn
          class="text-none flex-1-0"
          type="submit"
          variant="outlined"
          :disabled="regStore.pending"
      >
        <template v-if="regStore.pending">
          <v-progress-circular
              class="align-self-center"
              color="green"
              indeterminate
              size="small"
          ></v-progress-circular>
        </template>
        <template v-else>
          Далее
        </template>
      </v-btn>
    </div>



  </v-form>
</template>

<style scoped>

</style>