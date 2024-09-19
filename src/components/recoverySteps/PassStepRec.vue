<script setup lang="ts">

import {rules} from "@/helpers/baseTextValidator";
import {computed, onMounted, ref} from "vue";
import {checkPasswordStrength} from "@/helpers/passStrength";
import {replaceSymbols} from "@/helpers/replaceSymbols";
import {useRecoveryStore} from "@/stores/recSteps";
import {useAuthStore} from "@/stores/auth";
import {useRouter} from "vue-router";
import {useNotificationStore} from "@/stores/notifications";

const authStore = useAuthStore()
const recStore = useRecoveryStore()
const notificationsStore = useNotificationStore()

const router = useRouter()

const strength = computed((): number => checkPasswordStrength(password.value));

const isPasswordVisible = ref<boolean>(false);
const isPasswordConfirmVisible = ref<boolean>(false);

const password = ref<string>('');
const confirmPassword = ref<string>('');

const handleSubmit = async () => {
  if (strength.value < 2 || password.value !== confirmPassword.value || rules.fieldSymbols(password.value) !== true) return;

  const passChangeNeed = await authStore.changeUserPassword(recStore.recoveryUserEmail, password.value)

  if (!passChangeNeed){
    notificationsStore.addNotification('info', `Введенный пароль актуален для этой учетной записи, воспользуйтесь страницей авторизации`, 5000)
    return
  }

  const nickname = await authStore.login(recStore.recoveryUserEmail, password.value)

  if (!authStore.error){
    await router.push('/app');
    notificationsStore.addNotification('success', `Рады снова вас видеть, ${nickname}! Ваш пароль успешно изменен!`, 5000)
  }else{
    notificationsStore.addNotification('error', authStore.error, 3000)
  }
}
</script>

<template>
  <v-form @submit.prevent="handleSubmit" class="w-100 d-flex flex-column gap-3">
    <div class="position-relative">
      <div class="field">
        <label class="inp-default-label">Пароль:</label>
        <v-text-field
            v-model="password"
            :rules="[rules.fieldSymbols(password), rules.required, rules.lengthPass(password), rules.onlyDigitOrLetterPass(password)]"
            variant="outlined"
            :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="isPasswordVisible ? 'text' : 'password'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
            @input="checkPasswordStrength, password = replaceSymbols(password)"
            hide-details="auto"
        />
      </div>

      <div class="password-strength-indicator">
        <span :class="{ filled: strength >= 1 }"></span>
        <span :class="{ filled: strength >= 2 }"></span>
        <span :class="{ filled: strength >= 3 }"></span>
        <span :class="{ filled: strength >= 4 }"></span>
      </div>
    </div>

    <div class="field">
      <label class="inp-default-label">Подтверждение пароля:</label>
      <v-text-field
          v-model="confirmPassword"
          :rules="[rules.fieldSymbols(confirmPassword), rules.required, rules.mismatchPasswords(password, confirmPassword)]"
          variant="outlined"
          :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="isPasswordConfirmVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
          hide-details="auto"
          @input="confirmPassword = replaceSymbols(confirmPassword)"
      />
    </div>

    <div class="d-flex flex-column gap-1">

      <v-btn
          class="text-none flex-1-0"
          type="submit"
          variant="outlined"
          :disabled="authStore.pending"
      >
        <template v-if="authStore.pending">
          <v-progress-circular
              class="align-self-center"
              color="green"
              indeterminate
              size="small"
              :disabled="authStore.pending"
          ></v-progress-circular>
        </template>
        <template v-else>
          Завершить восстановление
        </template>
      </v-btn>
      <v-btn
          class="text-none flex-1-0"
          @click="recStore.resetSteps()"
          variant="plain"
          color="green"
          :disabled="authStore.pending"
      >
        Вернуться назад
      </v-btn>
    </div>

  </v-form>
</template>

<style scoped>
.password-strength-indicator {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 5px;
  right: -15px;
  top: 24px;
}

.password-strength-indicator span {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;

  transition: background-color 1s;
  border: 1px solid green;
}

.password-strength-indicator span.filled {
  background-color: green;
}
</style>