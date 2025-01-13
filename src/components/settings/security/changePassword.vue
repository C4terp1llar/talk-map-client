<script setup lang="ts">
import {rules} from "@/helpers/baseTextValidator";
import {checkPasswordStrength} from "@/helpers/passStrength";
import {replaceSymbols} from "@/helpers/replaceSymbols";
import {computed, onMounted, ref} from "vue";
import {useRegistrationStore} from "@/stores/regSteps";
import {debounce} from "perfect-debounce";
import NicknameIndicator from "@/components/nicknameIndicator.vue";
import PassIndicator from "@/components/passIndicator.vue";

onMounted(() => {

})

const strength = computed((): number => checkPasswordStrength(confirmPassword.value));

const isPasswordVisible = ref<boolean>(false);
const isPasswordConfirmVisible = ref<boolean>(false);

const password = ref<string>('');
const confirmPassword = ref<string>('');

const errorMessages = ref<string[]>([]);

const handleInputOldPassword = () => {

  nickname.value = replaceSymbols(nickname.value);

  if (nickname.value.length <= 5 || rules.lengthNickname(nickname.value) !== true || rules.fieldSymbols(nickname.value) !== true) {
    errorMessages.value = [];
    return
  }else{
    errorMessages.value = [];
    debouncedOperation();
  }
};

const debouncedOperation = debounce(async () => {
  // чек кпароля

  // if (isTaken) {
  //   errorMessages.value.push('Данный никнейм уже занят');
  // }
}, 1000);

const handleSubmit = () => {

}
</script>

<template>
  <div class="change-password__wrapper">

    <v-form @submit.prevent="handleSubmit" class="w-100 d-flex flex-column gap-3">
      <div class="position-relative">
        <div class="field">
          <label class="inp-default-label">Старый пароль:</label>
          <v-text-field
              v-model="password"
              :rules="[rules.required, rules.lengthPass(password)]"
              variant="outlined"
              :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="isPasswordVisible ? 'text' : 'password'"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
              @input="password = replaceSymbols(password)"
              hide-details="auto"
              :error-messages="errorMessages"
          />
        </div>

        <div class="password-indicator">
          <pass-indicator/>
        </div>
      </div>

      <div class="position-relative">
        <div class="field">
          <label class="inp-default-label">Новый Пароль:</label>
          <v-text-field
              v-model="confirmPassword"
              :rules="[rules.fieldSymbols(confirmPassword), rules.required, rules.lengthPass(password), rules.onlyDigitOrLetterPass(password)]"
              variant="outlined"
              :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="isPasswordConfirmVisible ? 'text' : 'password'"
              @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
              hide-details="auto"
              @input="checkPasswordStrength, confirmPassword = replaceSymbols(confirmPassword)"
          />
        </div>

        <div class="password-strength-indicator">
          <span :class="{ filled: strength >= 1 }"></span>
          <span :class="{ filled: strength >= 2 }"></span>
          <span :class="{ filled: strength >= 3 }"></span>
          <span :class="{ filled: strength >= 4 }"></span>
        </div>
      </div>

    </v-form>

  </div>
</template>

<style scoped lang="scss">
.change-password__wrapper{

}

.password-indicator{
  position: absolute;
  right: 0;
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