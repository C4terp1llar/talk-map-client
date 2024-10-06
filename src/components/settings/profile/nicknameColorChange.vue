<script setup lang="ts">

import ColorPicker from "@/components/settings/profile/colorPicker.vue";
import {useProfilePreviewStore} from "@/stores/profilePreview";
import {useUserStore} from "@/stores/user";
import {useNotificationStore} from "@/stores/notifications";

const profilePreview = useProfilePreviewStore()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

const handleChange = async () => {
  if (!profilePreview.newUserNicknameColor) return

  await userStore.changeUserNicknameColor(profilePreview.newUserNicknameColor)

  if (userStore.nicknameColorError) {
    notificationStore.addNotification('error', userStore.nicknameColorError, 5000)
  } else {
    profilePreview.newUserNicknameColor = null;
    notificationStore.addNotification('success', `Цвет никнейма успешно изменен!`, 5000)
  }
}

const handleChangeDefault = async () => {
  await userStore.changeUserNicknameColor('default')

  if (userStore.nicknameColorError) {
    notificationStore.addNotification('error', userStore.nicknameColorError, 5000)
  } else {
    notificationStore.addNotification('success', `Цвет никнейма успешно изменен на стандартный!`, 5000)
  }
}
</script>

<template>
  <div class="change-nickname-color-wrapper">
    <div class="change-nickname-color-changing">
      <v-btn
          variant="outlined"
          @click="profilePreview.newUserNicknameColor = null"
          :loading="userStore.nicknameColorPending"
          :disabled="userStore.nicknameColorPending"
      >
        <v-icon>mdi-close-outline</v-icon>
      </v-btn>

      <color-picker/>

      <v-btn
          variant="outlined"
          @click="handleChange"
          :loading="userStore.nicknameColorPending"
          :disabled="userStore.nicknameColorPending"
      >
        <v-icon>mdi-check-outline</v-icon>
      </v-btn>
    </div>
    <v-btn
        v-if="userStore.mainUserInfo?.nickname_color"
        class="text-none text-green w-100 mt-1"
        variant="plain"
        @click="handleChangeDefault"
        :loading="userStore.nicknameColorPending"
        :disabled="userStore.nicknameColorPending"
    >
      Стандартный цвет
    </v-btn>
  </div>

</template>

<style scoped>

  .change-nickname-color-changing {
    display: flex;
    gap: 10px;
    width: 100%;
    align-items: center;
  }

</style>