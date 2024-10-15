<script setup lang="ts">
import {ref} from "vue";
import {replaceSymbols} from "@/helpers/replaceSymbols";
import EmojiPicker from "@/components/common/emojiPicker.vue";
import {useUserStore} from "@/stores/user";
import {useNotificationStore} from "@/stores/notifications";

const userStore = useUserStore()
const notificationsStore = useNotificationStore()
const tag = ref<string>('')
const isPickerVisible = ref<boolean>(false)

const handleClosePicker = () => {
  setTimeout(() => {
    isPickerVisible.value = false
  }, 1)
}

const handleSelect = (emoji: string) => {
  userStore.newTagEmoji = emoji;
}

const handleDefault = () => {
  userStore.newTagEmoji = '';
  userStore.newTagText = '';
  tag.value = ''
}

const handleInput = () => {
  if (tag.value.trim().length === 0) {
    tag.value = "";
  }
  userStore.newTagText = tag.value;
}

const handleSubmit = async () => {
  if (!userStore.newTagText || !userStore.newTagEmoji) return;

  const tagExists = isTagExist()

  if (tagExists) {
    notificationsStore.addNotification('info', 'Данный тег уже существует', 5000)
    tag.value = '';
    userStore.newTagText = '';
    return
  }

  await userStore.setUserTag()
  handleDefault()

  if(userStore.tagError){
    notificationsStore.addNotification('error', userStore.tagError, 5000)
  }else{
    notificationsStore.addNotification('success', 'Тег успешно добавлен', 5000)
  }
}

const isTagExist = () => {
  if (userStore.mainUserInfo) {
    return userStore.mainUserInfo.tags?.find(tag =>
        tag.text === userStore.newTagText
    );
  }
}
</script>

<template>
  <div class="tag-select-wrapper">

    <div class="emoji-select-wrapper">
      <v-scroll-y-transition>
        <emoji-picker v-if="isPickerVisible" select-mode="single" @close="handleClosePicker" @select="emoji => handleSelect(emoji)" />
      </v-scroll-y-transition>
    </div>

    <v-btn
        class="h-auto"
        @click="isPickerVisible = true"
        variant="outlined"
        :disabled="userStore.tagPending"
    >
      <v-icon>mdi-sticker-emoji</v-icon>
    </v-btn>

    <v-text-field
        v-model="tag"
        class="w-100"
        variant="outlined"
        maxlength="20"
        hide-details="auto"
        @input="handleInput"
    />

    <v-btn
        class="h-auto"
        @click="handleSubmit"
        variant="outlined"
        :loading="userStore.tagPending"
        :disabled="userStore.tagPending || userStore.tagDeletePending"
    >
      <v-icon>mdi-check-outline</v-icon>
    </v-btn>
  </div>

  <v-dialog-transition>
    <v-btn
        v-if="userStore.newTagEmoji || userStore.newTagText"
        class="text-none mt-1"
        variant="plain"
        color="green"
        @click="handleDefault"
        :disabled="userStore.tagPending || userStore.tagDeletePending"
    >
      Сбросить
    </v-btn>
  </v-dialog-transition>
</template>

<style scoped lang="scss">
.tag-select-wrapper{
  display: flex;
  gap: 10px;
  position: relative;
}
.emoji-select-wrapper{
  top: 65px;
  position: absolute;
  z-index: 9999;
}
</style>