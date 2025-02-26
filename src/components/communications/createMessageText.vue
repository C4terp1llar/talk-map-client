<script setup lang="ts">
import type { EmojiExt } from "vue3-emoji-picker";
import V3Picker from "@/components/common/v3Picker.vue";
import { ref, watch, nextTick } from "vue";

const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
  (e: "actAttachments"): void;
  (e: "sendMessage"): void;
}>();

interface Props {
  modelValue: string;
  mode?: 'change' | 'default'
}
const props = defineProps<Props>();

const isPickerVisible = ref<boolean>(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const maxTextareaHeight = 150;

const handleSelect = (emoji: EmojiExt) => {
  emit("update:modelValue", props.modelValue + emoji.i);
};

const handleClosePicker = () => {
  setTimeout(() => {
    isPickerVisible.value = false;
  });
};

const adjustTextareaHeight = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  emit("update:modelValue", target.value);

  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
    const newHeight = Math.min(textareaRef.value.scrollHeight, maxTextareaHeight);
    textareaRef.value.style.height = `${newHeight}px`;
  }
};

const handleSendMessage = () => {
  emit('sendMessage')
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = "auto";
    }
  });
}
</script>

<template>
  <div class="create-message-text__wrapper">
    <div class="create-message-text__content">
      <button class="create-message__action-btn" @click="isPickerVisible = !isPickerVisible">
        <v-icon :size="24">mdi-sticker-emoji</v-icon>
      </button>

      <button class="create-message__action-btn" @click="emit('actAttachments')">
        <v-icon :size="24">mdi-paperclip</v-icon>
      </button>

      <textarea
          ref="textareaRef"
          :value="modelValue"
          @input="adjustTextareaHeight"
          @keydown.enter="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
          placeholder="Напишите что-нибудь..."
          class="custom-textarea styled-scroll__np"
          rows="1"
          :maxlength="1000"
      ></textarea>

      <button class="create-message__action-btn" @click="handleSendMessage">
        <v-icon :size="24">{{ mode === 'change' ? 'mdi-send-check' : 'mdi-send' }}</v-icon>
      </button>
    </div>

    <div class="emoji-picker__wrapper" v-if="isPickerVisible">
      <v3-picker :is-short="true" @close="handleClosePicker" @select="(payload: EmojiExt) => handleSelect(payload)" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.create-message-text__wrapper {
  width: 100%;
  position: relative;
  height: fit-content;

  .create-message__action-btn {
    padding: 1px;
    transition: 0.3s;
    height: fit-content;

    &:hover {
      filter: drop-shadow(0 0 1px currentColor);
    }
  }

  .create-message-text__content {
    display: flex;
    padding: 10px 5px;
    gap: 3px;
    box-shadow: 0 0 5px currentColor;
    border-radius: 10px;
  }

  .custom-textarea {
    width: 100%;
    resize: none;
    background: rgb(var(--v-theme-background));
    color: currentColor;
    overflow-y: auto;
    max-height: 200px;
    outline: none;
    padding-top: 2px;
  }

  .emoji-picker__wrapper {
    position: absolute;
    z-index: 10000;
    bottom: 110%;
  }
}
</style>
