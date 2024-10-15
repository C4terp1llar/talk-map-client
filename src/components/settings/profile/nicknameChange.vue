<script setup lang="ts">

import {rules} from "@/helpers/baseTextValidator";
import {useRegistrationStore} from "@/stores/regSteps";
import {onMounted, ref} from "vue";
import {replaceSymbols} from "@/helpers/replaceSymbols";
import {debounce} from "perfect-debounce";
import NicknameIndicator from "@/components/nicknameIndicator.vue";
import {useUserStore} from "@/stores/user";
import {useNotificationStore} from "@/stores/notifications";
import {useProfilePreviewStore} from "@/stores/profilePreview";

const userStore = useUserStore()
const regStore = useRegistrationStore();
const notificationStore = useNotificationStore()
const profilePreview = useProfilePreviewStore()

const nickname = ref<string>(userStore.mainUserInfo?.nickname || '');

const errorMessages = ref<string[]>([]);

const handleInputNickname = () => {

  nickname.value = replaceSymbols(nickname.value);

  if (nickname.value.length <= 5 || rules.lengthNickname(nickname.value) !== true || rules.fieldSymbols(nickname.value) !== true) {
    errorMessages.value = [];
    return
  } else {
    errorMessages.value = [];
    regStore.isNicknameTaken = '';
    debouncedOperation();
  }
};

const debouncedOperation = debounce(async () => {
  if (nickname.value === userStore.mainUserInfo?.nickname || nickname.value.length <= 5 || rules.lengthNickname(nickname.value) !== true || rules.fieldSymbols(nickname.value) !== true) {
    profilePreview.newUserNickname = userStore.mainUserInfo?.nickname
    return
  }

  const isTaken = await regStore.checkNicknameAvailable(nickname.value);

  if (isTaken) {
    errorMessages.value.push('Данный никнейм уже занят');
    profilePreview.newUserNickname = userStore.mainUserInfo?.nickname
  } else {
    profilePreview.newUserNickname = nickname.value;
  }
}, 1000);

const handleBlur = () => {
  if (rules.lengthNickname(nickname.value) !== true || rules.fieldSymbols(nickname.value) !== true){
    if (userStore.mainUserInfo?.nickname) {
      nickname.value = userStore.mainUserInfo?.nickname
      profilePreview.newUserNickname = userStore.mainUserInfo?.nickname
    }
  }
}

const handleChange = async () => {
  if (nickname.value === userStore.mainUserInfo?.nickname || regStore.isNicknameTaken !== 'false' || rules.lengthNickname(nickname.value) !== true || rules.fieldSymbols(nickname.value) !== true) return;

  await userStore.changeUserNickname(nickname.value)

  if (userStore.nicknameError) {
    notificationStore.addNotification('error', userStore.nicknameError, 5000)
  } else {
    notificationStore.addNotification('success', `Ваш никнейм успешно изменен, ${userStore.mainUserInfo?.nickname} !`, 5000)
  }
}

onMounted(() => profilePreview.newUserNickname = nickname.value)
</script>

<template>
  <div class="field">
    <div class="field-content">
      <div class="position-relative w-100">
        <v-text-field
            v-model="nickname"
            :rules="[rules.fieldSymbols(nickname), rules.lengthNickname(nickname)]"
            class="w-100"
            variant="outlined"
            maxlength="20"
            hide-details="auto"
            @input="handleInputNickname"
            :error-messages="errorMessages"
            @keydown.enter="handleChange"
            @blur="handleBlur"
        />

        <nickname-indicator class="indicator" v-if="nickname.length > 5"/>
      </div>

      <v-btn
          type="submit"
          class="h-auto"
          @click="handleChange"
          variant="outlined"
          :loading="userStore.nicknamePending"
          :disabled="userStore.nicknamePending"
      >
        <v-icon>mdi-check-outline</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<style scoped>

.indicator {
  right: 15px;
}

.field-content {
  display: flex;
  gap: 10px;
}
</style>