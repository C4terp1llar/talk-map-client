<script setup lang="ts">
import { ref } from 'vue';
import { type EmojiExt } from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import V3Picker from "@/components/common/v3Picker.vue";

const emit = defineEmits(["update:modelValue"]);

interface Props {
  modelValue: string;
}
const props = defineProps<Props>();

const isPickerVisible = ref<boolean>(false);

const handleSelect = (emoji: EmojiExt) => {
  emit('update:modelValue', props.modelValue + emoji.i);
};

const handleClosePicker = () => {
  setTimeout(() => {
    isPickerVisible.value = false;
  });
};
</script>

<template>
  <div class="post-editor__text-wrapper">
    <div class="post-editor__text-content">
      <button class="post-editor__action-btn" @click="isPickerVisible = !isPickerVisible">
        <v-icon :size="28">mdi-sticker-emoji</v-icon>
      </button>

      <textarea
          :value="modelValue"
          @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
          rows="3"
          placeholder="Напишите что-нибудь..."
          class="custom-textarea styled-txt-scroll"
          :maxlength="1000"
      ></textarea>

    </div>

    <div class="emoji-picker__wrapper" v-if="isPickerVisible">
      <v3-picker :is-short="true" @close="handleClosePicker" @select="(payload: EmojiExt) => handleSelect(payload)"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.post-editor__text-wrapper{
  width: 100%;
  position: relative;
  height: fit-content;

  .post-editor__action-btn {
    padding: 0 5px 5px 5px;
    transition: 0.3s;
    height: fit-content;

    &:hover {
      filter: drop-shadow(0 0 3px currentColor);
    }
  }

  .post-editor__text-content {
    display: flex;
    gap: 5px;
  }

  .custom-textarea {
    width: 100%;
    border: 1px solid currentColor;
    border-radius: 5px;
    padding: 8px;
    resize: none;
    background: rgb(var(--v-theme-background));
    color: currentColor;

    &:focus {
      outline: 2px solid var(--v-theme-primary);
    }
  }

  .emoji-picker__wrapper {
    position: absolute;
    z-index: 10000;
    bottom: 110%;
  }
}


.styled-txt-scroll::-webkit-scrollbar {
  width: 8px;
  margin-right: 5px;
}

.styled-txt-scroll::-webkit-scrollbar-thumb {
  background-color: #c4c4c4;
  border-radius: 15px;
}

.styled-txt-scroll::-webkit-scrollbar-track {
  background: #777777;
  border-radius: 15px;
}
</style>