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

const emit = defineEmits<{
  (e: 'clearReply'): void,
  (e: 'reloadComments', mode: 'comments' | 'replies'): void,
  (e: 'commentUpdated', payload: {comment_id: string, newText: string, updated: Date}): void,
}>();

interface Props {
  entityType: 'Publication' | 'Post' | 'Comment',
  entityId: string,
  mode: 'internal' | 'external',
  parentCommentId?: string,
  reply: {comment_id: string, to: { _id: string; nickname: string; nickname_color: string | null; avatar: string}} | null,
  changeText?: string;
  comment_id?: string;
  uniq?: number
}

const props = withDefaults(defineProps<Props>(), {
  uniq: Date.now()
});

const postStore = usePostStore();
const nthStore = useNotificationStore();

const commentText = ref<string>(props.changeText || '');

const isPickerVisible = ref<boolean>(false);

const handleClosePicker = () => {
  setTimeout(() => {
    isPickerVisible.value = false;
  });
};

const handleSelect = (emoji: EmojiExt) => {
  commentText.value += emoji.i;
};

const currentPending = ref<number | null>(null)

const handleComment = async () => {
  commentText.value = commentText.value.trim();
  if (!commentText.value.trim() || postStore.createCommPending) return

  currentPending.value = props.uniq;
  if (!props.reply){
    await postStore.createComment(props.entityType, props.entityId, commentText.value, props.parentCommentId);
  }else{
    await postStore.createComment(props.entityType, props.entityId, commentText.value, props.reply.comment_id);
  }

  if (postStore.createCommError){
    nthStore.addNotification('error', postStore.createCommError, 3000);
  }else{
    emit('reloadComments', !props.reply ? 'comments' : 'replies');
    commentText.value = '';
    emit('clearReply')
    nthStore.addNotification('success', 'Комментарий успешно опубликован!', 3000);
  }
  currentPending.value = null;
}

const handleChangeComment = async () => {
  if (props.changeText && props.changeText.trim() && commentText.value.trim() &&  props.changeText.trim() !== commentText.value && props.comment_id){

    currentPending.value = props.uniq;

    let newCommentText = commentText.value.trim()
    let commentID = props.comment_id;

    const {updatedAt, text} = await postStore.updateComment(commentID, newCommentText)

    currentPending.value = null;

    if (postStore.updCommError){
      nthStore.addNotification('error', postStore.updCommError, 3000);
    }else if (updatedAt && text && !postStore.updCommError){
      emit('commentUpdated', {comment_id: commentID, newText: text, updated: updatedAt})
      nthStore.addNotification('success', 'Комментарий успешно изменен!', 3000);
    }
  }
}

</script>

<template>
  <div class="post-editor__text-wrapper">

    <editor-reply-chip v-if="props.reply" :reply="props.reply" @clear-reply="emit('clearReply')"/>

    <v-form @submit.prevent="changeText ? handleChangeComment() : handleComment()" class="post-editor__text-content">
      <button type="button" class="post-editor__action-btn" @click="isPickerVisible = !isPickerVisible">
        <v-icon :size="28">mdi-sticker-emoji</v-icon>
      </button>

        <v-textarea
            class="fz-12"
            variant="outlined"
            v-model="commentText"
            no-resize
            rows="1"
            placeholder="Напишите что-нибудь..."
            :maxlength="1000"
            :counter="commentText.trim()"
            :disabled="currentPending === props.uniq"
        />

      <button :disabled="currentPending === props.uniq"
              :class="['post-editor__action-btn', {'blinking__pending': currentPending === props.uniq}]"
              type="submit"
      >
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
    padding: 5px;
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