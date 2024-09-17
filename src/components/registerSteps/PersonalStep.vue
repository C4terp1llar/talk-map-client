<script setup lang="ts">
import {rules} from "@/helpers/baseTextValidator";
import {useRegistrationStore} from "@/stores/regSteps";
import {onMounted, ref} from "vue";
import {replaceSymbols} from "@/helpers/replaceSymbols";

onMounted(() => {
  nickname.value = regStore.newUserNickname;
  date.value = regStore.newUserDateB;
  gender.value = regStore.newUserGender;
})

const regStore = useRegistrationStore();

const nickname = ref<string>('');
const date = ref<string>('');
const gender = ref<string>('');

const handleSubmit = () => {
  if (!gender.value.length || rules.minAge(date.value) !== true || rules.lengthNickname(nickname.value) !== true || rules.fieldSymbols(nickname.value) !== true) return

  regStore.setNewUserPersonal(nickname.value, date.value, gender.value);

  regStore.nextStep()
}
</script>

<template>
  <v-form @submit.prevent="handleSubmit" class="w-100 d-flex flex-column gap-3">

    <div class="field">
      <label class="inp-default-label">Никнейм:</label>
      <v-text-field
          v-model="nickname"
          :rules="[rules.fieldSymbols(nickname), rules.required, rules.lengthNickname(nickname)]"
          class="w-100"
          variant="outlined"
          maxlength="25"
          hide-details="auto"
          @input="nickname = replaceSymbols(nickname)"
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

    <div class="d-flex flex-column gap-1">

      <v-btn
          class="text-none flex-1-0"
          type="submit"
          variant="outlined"
      >
        Далее
      </v-btn>
      <v-btn
          class="text-none flex-1-0"
          @click="regStore.prevStep()"
          variant="plain"
          color="green"
      >
        Вернуться назад
      </v-btn>
    </div>
  </v-form>
</template>

<style scoped>

</style>