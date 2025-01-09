<script setup lang="ts">
import type {UserComment} from "@/helpers/interfaces";
import {ref} from "vue";
import {onClickOutside} from "@vueuse/core";
import {usePostStore} from "@/stores/post";
import {useNotificationStore} from "@/stores/notifications";

const emit = defineEmits<{
  (e: 'deleteComment', payload: {mode: 'comment' | 'reply', comment_id: string, act: 'deleted' | 'markDelete' }): void,
  (e: 'changeComment'): void
}>();

interface Props {
  comment: UserComment,
  entityType: 'Publication' | 'Post' | 'Comment',
  entityId: string,
  mode: 'comment' | 'reply'
}

const props = defineProps<Props>();

const postStore = usePostStore()
const nthStore = useNotificationStore();

const handleDelete = async () => {
  if (postStore.delCommPending) return;

  const {success, act} = await postStore.deleteComment(props.comment._id);

  if (success && act && !postStore.delCommError){
    emit('deleteComment', {mode: props.mode, comment_id: props.comment._id, act: act});
  }else if (!success && postStore.delCommError){
    nthStore.addNotification('error', postStore.delCommError, 3000)
  }

}

const handleChange = () => {
  emit('changeComment')
  isCommentMenuVisible.value = false
}

const commentMenuRef = ref<HTMLElement | null>(null);
const isCommentMenuVisible = ref(false);
const clickOutside = () => {
  setTimeout(() => {isCommentMenuVisible.value = false})
};
onClickOutside(commentMenuRef, clickOutside);
</script>

<template>
  <div class="item-internal__actions">
    <button class="more__btn" @click="isCommentMenuVisible = true">
      <v-icon :size="18">mdi-dots-horizontal</v-icon>
    </button>

    <div class="comment-internal-actions__menu" v-if="isCommentMenuVisible" ref="commentMenuRef">

      <v-btn
          variant="text"
          class="text-none w-100 justify-content-start"
          prepend-icon="mdi-pencil-outline"
          size="small"
          @click="handleChange"
          :disabled="postStore.delCommPending || postStore.updCommPending"
          :loading="postStore.updCommPending"
      >
        Изменить
      </v-btn>

      <v-btn
          variant="text"
          class="text-none w-100 justify-content-start"
          prepend-icon="mdi-delete-outline"
          size="small"
          @click="handleDelete"
          :disabled="postStore.delCommPending || postStore.updCommPending"
          :loading="postStore.delCommPending"
      >
        Удалить
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item-internal__actions{
  position: relative;

  .more__btn{
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    transition: 0.3s;
    padding-right: 5px;
    &:hover {
      filter: drop-shadow(0 0 2px currentColor);
    }
  }

  .comment-internal-actions__menu{
    z-index: 10;
    position: absolute;
    right: 0;
    top: 105%;
    padding: 7px;
    border-radius: 15px;
    box-shadow: 0 1px 10px currentColor;
    background: rgb(var(--v-theme-background));
  }
}

</style>