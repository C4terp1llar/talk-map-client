<script setup lang="ts">
import {useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter()
const isPasswordVisible = ref<boolean>(false);

const handleSubmit = () => {
  console.log('kjuby')
}

</script>

<template>
  <div class="wrapper">

    <v-form @submit.prevent="handleSubmit" class="w-100 d-flex flex-column gap-2">

      <v-text-field
          class="w-100"
          variant="outlined"
          type="email"
          label="Email"
          maxlength="50"
      />

      <v-text-field
          class="w-100"
          variant="outlined"
          label="Пароль"
          maxlength="50"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="isPasswordVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
      />

      <v-btn
          type="submit"
          class="align-self-center text-none w-100"
          variant="outlined"
      >
        Войти
      </v-btn>

      <router-link class="align-self-center" to="recovery">Забыли аккаунт?</router-link>

      <div class="d-flex align-items-center justify-content-center gap-2 co">
        <hr class="m-0 w-100">
        <span class="small mb-1 or-txt">или</span>
        <hr class="m-0 w-100">
      </div>

      <v-btn
          class="text-none w-100"
          @click="router.push('/registration')"
          variant="outlined"
      >
        Зарегистрироваться
      </v-btn>

    </v-form>

  </div>
</template>

<style scoped lang="scss">
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

.or-txt {
  color: grey;
}
</style>