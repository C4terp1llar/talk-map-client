<script setup lang="ts">
import {useRouter} from "vue-router";
import {ref} from "vue";
import {rules} from "@/helpers/baseTextValidator";

const date = ref<string>('');
const password = ref<string>('');
const email = ref<string>('');


const router = useRouter()

const isPasswordVisible = ref<boolean>(false);

const handleSubmit = () => {
  console.log('рег')
}
</script>

<template>
  <div class="wrapper">

    <v-form @submit.prevent="handleSubmit" class="w-100 d-flex flex-column gap-3">

      <v-text-field
          v-model="email"
          :rules="[rules.required, rules.email]"
          class="w-100"
          variant="outlined"
          type="email"
          label="Email"
          maxlength="50"
          hide-details="auto"
      />

      <v-text-field
          v-model="password"
          :rules="[rules.required, rules.lengthPass(password), rules.onlyDigitOrLetterPass(password)]"
          variant="outlined"
          label="Пароль"
          maxlength="50"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="isPasswordVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
          hide-details="auto"
      />

      <v-text-field
          v-model="date"
          :rules="[rules.required, rules.minAge]"
          variant="outlined"
          type="date"
          hide-details="auto"
      ></v-text-field>

      <v-btn
          class="text-none w-100"
          type="submit"
          variant="outlined"
      >
        Зарегистрироваться
      </v-btn>

      <router-link class="align-self-center" to="login">Уже есть аккаунт?</router-link>

    </v-form>

  </div>
</template>

<style scoped>
.wrapper {
  width: 350px;
  height: auto;
  padding: 50px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>