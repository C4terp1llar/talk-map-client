<script setup lang="ts">
import {useSecurityStore} from "@/stores/security";
import {useNotificationStore} from "@/stores/notifications";
import {computed, ref} from "vue";
import {checkPasswordStrength} from "@/helpers/passStrength";
import {replaceSymbols} from "@/helpers/replaceSymbols";
import {rules} from "@/helpers/baseTextValidator";
import {debounce} from "perfect-debounce";
import PassIndicator from "@/components/passIndicator.vue";

const secureStore = useSecurityStore();
const ntfStore = useNotificationStore();

const strength = computed((): number => checkPasswordStrength(newPassword.value));

const isPasswordVisible = ref<boolean>(false);
const isPasswordConfirmVisible = ref<boolean>(false);

const password = ref<string>('');
const newPassword = ref<string>('');

const errorMessages = ref<string[]>([]);

const handleInputOldPassword = () => {
  password.value = replaceSymbols(password.value);
  oldPassMatch.value = null;

  if (password.value.length < 5 || rules.lengthPass(password.value) !== true) {
    errorMessages.value = [];
    return
  }else{
    errorMessages.value = [];
    debouncedOperation();
  }
};

const oldPassMatch = ref<boolean | null>(null)

const debouncedOperation = debounce(async () => {
  const {match} = await secureStore.checkPassword(password.value)

  oldPassMatch.value = match

  if (!match) {
    errorMessages.value.push('Пароль некорректный');
  }
}, 1000);

const handleSubmit = async () => {
  if (rules.passMismatch(password.value, newPassword.value) !== true  || secureStore.checkPending || rules.fieldSymbols(newPassword.value) !== true
      || rules.lengthPass(newPassword.value) !== true || rules.onlyDigitOrLetterPass(newPassword.value) !== true || strength.value < 2 || !oldPassMatch.value
  ) return;

  const data = await secureStore.changePassword(newPassword.value)

  password.value = '';
  newPassword.value = '';
  oldPassMatch.value = null;

  ntfStore.addNotification(data.s, data.message, 3000)
}
</script>

<template>
  <v-divider class="mt-2 mb-2"/>
  <v-form validate-on="submit lazy" @submit.prevent="handleSubmit" class="w-100 d-flex flex-column gap-3 form-change-pass">
    <div class="field">
      <label class="inp-default-label">Текущий пароль:</label>

      <div class="position-relative">
        <v-text-field
            v-model.trim="password"
            :rules="[rules.required, rules.lengthPass(password)]"
            variant="outlined"
            :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="isPasswordVisible ? 'text' : 'password'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
            @input="handleInputOldPassword"
            hide-details="auto"
            :error-messages="errorMessages"
            :disabled="secureStore.pending"
        />
        <div class="password-indicator">
          <pass-indicator :pending="secureStore.pending" :match="oldPassMatch"/>
        </div>
      </div>
    </div>

    <div class="position-relative">
      <div class="field">
        <label class="inp-default-label">Новый Пароль:</label>
        <v-text-field
            v-model.trim="newPassword"
            :rules="[rules.required, rules.fieldSymbols(newPassword), rules.lengthPass(newPassword), rules.onlyDigitOrLetterPass(newPassword), rules.passMismatch(password,newPassword)]"
            variant="outlined"
            :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="isPasswordConfirmVisible ? 'text' : 'password'"
            @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
            hide-details="auto"
            @input="checkPasswordStrength, newPassword = replaceSymbols(newPassword)"
            :disabled="secureStore.pending"
        />
      </div>

      <div class="password-strength-indicator">
        <span :class="{ filled: strength >= 1 }"></span>
        <span :class="{ filled: strength >= 2 }"></span>
        <span :class="{ filled: strength >= 3 }"></span>
        <span :class="{ filled: strength >= 4 }"></span>
      </div>
    </div>

    <v-btn :loading="secureStore.pending" :disabled="secureStore.pending" color="green" variant="outlined" class="text-none" type="submit">Изменить</v-btn>
  </v-form>
</template>

<style scoped lang="scss">
.form-change-pass{
  padding: 0 10px;
  @media (max-width: 650px) {
    padding: 0 15px 0 5px;
  }
}

.password-indicator{
  position: absolute;
  right: -18px;
  top: 0;
}

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