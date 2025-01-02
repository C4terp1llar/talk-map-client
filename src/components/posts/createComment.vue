<script setup lang="ts">
import {ref} from 'vue';
import {type EmojiExt} from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import V3Picker from "@/components/common/v3Picker.vue";
import {rules} from "@/helpers/baseTextValidator";
import {usePostStore} from "@/stores/post";
import {useNotificationStore} from "@/stores/notifications";


interface Props {
  entityType: 'Publication' | 'Post' | 'Comment',
  entityId: string,
  mode: 'internal' | 'external',
  parentCommentId?: string
}

const props = defineProps<Props>();

const postStore = usePostStore();
const nthStore = useNotificationStore();

const commentText = ref<string>('');

const isPickerVisible = ref<boolean>(false);

const handleClosePicker = () => {
  setTimeout(() => {
    isPickerVisible.value = false;
  });
};

const handleSelect = (emoji: EmojiExt) => {
  commentText.value += emoji.i;
};

const handleComment = async () => {
  commentText.value = commentText.value.trim();
  if (rules.lengthComment(commentText.value) !== true) return


}
</script>

<template>
  <div class="post-editor__text-wrapper">

    <v-form validate-on="submit" @submit.prevent="handleComment" class="post-editor__text-content">
      <button class="post-editor__action-btn" @click="isPickerVisible = !isPickerVisible">
        <v-icon :size="28">mdi-sticker-emoji</v-icon>
      </button>

      <v-textarea
          variant="outlined"
          v-model="commentText"
          no-resize
          rows="2"
          placeholder="Напишите что-нибудь..."
          :maxlength="1000"
          :counter="commentText.trim()"
          :rules="[rules.required, rules.lengthComment(commentText)]"
      />

      <button class="post-editor__action-btn" type="submit">
        <v-icon :size="28">mdi-send-variant-outline</v-icon>
      </button>
    </v-form>

    <div class="emoji-picker__wrapper" v-if="isPickerVisible">
      <v3-picker :is-short="true" @close="handleClosePicker" @select="(payload: EmojiExt) => handleSelect(payload)"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.post-editor__text-wrapper {
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


  .emoji-picker__wrapper {
    position: absolute;
    z-index: 10000;
    bottom: 110%;
  }
}


</style>