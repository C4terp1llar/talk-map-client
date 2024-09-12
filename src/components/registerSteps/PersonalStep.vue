<script setup lang="ts">
import {rules} from "@/helpers/baseTextValidator";
import {useRegistrationStore} from "@/stores/regSteps";
import {ref} from "vue";

const regStore = useRegistrationStore();

const name = ref<string>('');
const date = ref<string>('');
const gender = ref<string>('');

const handleSubmit = () => {
  console.log(name.value, date.value, gender.value);
  regStore.nextStep()
}
</script>

<template>
  <v-form @submit.prevent="handleSubmit" class="w-100 d-flex flex-column gap-3">

    <div class="field">
      <label class="inp-default-label">Имя:</label>
      <v-text-field
          v-model="name"
          :rules="[rules.required]"
          class="w-100"
          variant="outlined"
          maxlength="25"
          hide-details="auto"
      />
    </div>

    <div class="field">
      <label class="inp-default-label">Дата рождения:</label>
      <v-text-field
          v-model="date"
          :rules="[rules.required, rules.minAge]"
          variant="outlined"
          placeholder="Дата Рождения"
          type="date"
          hide-details="auto"
      />
    </div>

    <div class="field">
      <label class="inp-default-label">Пол:</label>
      <v-select
          v-model="gender"
          :items="['Мужской', 'Женский']"
          :rules="[rules.required]"
          class="w-100"
          variant="outlined"
          hide-details="auto"
      />
    </div>

    <div class="d-flex gap-3">
      <v-btn
          class="text-none flex-1-0"
          variant="outlined"
          @click="regStore.prevStep()"
      >
        Назад
      </v-btn>
      <v-btn
          class="text-none flex-1-0"
          type="submit"
          variant="outlined"
      >
        Далее
      </v-btn>
    </div>
  </v-form>
</template>

<style scoped>

</style>