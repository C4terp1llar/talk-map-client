<script setup lang="ts">
import {useRouter} from "vue-router";
import {ref} from "vue";
import {rules} from "@/helpers/baseTextValidator";
import {replaceSymbols} from "@/helpers/replaceSymbols";
import {useAuthStore} from "@/stores/auth";
import {useNotificationStore} from "@/stores/notifications";

const authStore = useAuthStore();
const notificationsStore = useNotificationStore();

const router = useRouter()
const isPasswordVisible = ref<boolean>(false);

const password = ref<string>('');
const email = ref<string>('');

const handleSubmit = async () => {
  if (rules.email(email.value) !== true || rules.required(password.value) !== true) return

  const nickname = await authStore.login(email.value, password.value);

  if (!authStore.error){
    await router.push('/app');
    notificationsStore.addNotification('success', `Рады снова вас видеть, ${nickname}!`, 3000)
  }else{
    notificationsStore.addNotification('error', authStore.error, 3000)
  }
}

</script>

<template>
  <div class="wrapper-page-main-content">

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

      <div class="field">
        <label class="inp-default-label">Пароль:</label>
        <v-text-field
            v-model="password"
            :rules="[rules.fieldSymbols(password), rules.required]"
            variant="outlined"
            :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="isPasswordVisible ? 'text' : 'password'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
            @input="password = replaceSymbols(password)"
            hide-details="auto"
        />
      </div>

      <v-btn
          type="submit"
          class="align-self-center text-none w-100"
          variant="outlined"
          :disabled="authStore.pending"
      >
        <template v-if="authStore.pending">
          <v-progress-circular
              class="align-self-center"
              color="green"
              indeterminate
              size="small"
          ></v-progress-circular>
        </template>
        <template v-else>
          Войти
        </template>
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
          :disabled="authStore.pending"
      >
        Зарегистрироваться
      </v-btn>

    </v-form>

  </div>
</template>

<style scoped lang="scss">

.or-txt {
  color: grey;
}
</style>