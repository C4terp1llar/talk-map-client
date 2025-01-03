<script setup lang="ts">
import {ref} from 'vue';
import {type EmojiExt} from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import V3Picker from "@/components/common/v3Picker.vue";
import {rules} from "@/helpers/baseTextValidator";
import {usePostStore} from "@/stores/post";
import {useNotificationStore} from "@/stores/notifications";
import CircularLoader from "@/components/common/circularLoader.vue";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import EditorReplyChip from "@/components/posts/editorReplyChip.vue";

const emit = defineEmits(['clearReply'])

interface Props {
  entityType: 'Publication' | 'Post' | 'Comment',
  entityId: string,
  mode: 'internal' | 'external',
  parentCommentId?: string,
  reply: {comment_id: string, to: { _id: string; nickname: string; nickname_color: string | null; avatar: string}} | null
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
  if (!commentText.value.trim() || postStore.createCommPending) return

  if (!props.reply){
    await postStore.createComment(props.entityType, props.entityId, commentText.value, props.parentCommentId);
  }else{
    await postStore.createComment(props.entityType, props.entityId, commentText.value, props.reply.comment_id);
  }

  if (postStore.createCommError){
    nthStore.addNotification('error', postStore.createCommError, 3000);
  }else{
    commentText.value = '';
    nthStore.addNotification('success', 'Комментарий успешно опубликован!', 3000);
  }
}

//entityType: 'Publication' | 'Post' | 'Comment', entityId: string, text: string, parentCommentId?: string
</script>

<template>
  <div class="post-editor__text-wrapper">

    <editor-reply-chip v-if="props.reply" :reply="props.reply" @clear-reply="emit('clearReply')"/>

    <v-form @submit.prevent="handleComment" class="post-editor__text-content">
      <button type="button" class="post-editor__action-btn" @click="isPickerVisible = !isPickerVisible">
        <v-icon :size="28">mdi-sticker-emoji</v-icon>
      </button>

        <v-textarea
            variant="outlined"
            v-model="commentText"
            no-resize
            rows="1"
            placeholder="Напишите что-нибудь..."
            :maxlength="1000"
            :counter="commentText.trim()"
            :disabled="postStore.createCommPending"
        />

      <button :disabled="postStore.createCommPending" :class="['post-editor__action-btn', postStore.createCommPending ? 'blinking__pending' : '']" type="submit">
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