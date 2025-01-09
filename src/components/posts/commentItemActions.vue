<script setup lang="ts">
import type {UserComment} from "@/helpers/interfaces";
import {formatShortDate} from "@/helpers/dateHelper";

const emit = defineEmits<{
  (e: 'reply', payload: {comment_id: string, to: { _id: string; nickname: string; nickname_color: string | null; avatar: string}}): void,
  (e: 'actSubComments'): void
}>()

interface Props {
  comment: UserComment,
  entityId: string,
  mode: 'internal' | 'external',
  parentCommentId?: string,
  repliesMode?: boolean,
}

const props = defineProps<Props>();
</script>

<template>
  <div class="item__actions">
    <div class="exact__actions" v-if="!props.repliesMode">
      <button class="item__replies-btn" v-if="!comment.isDeleted" @click="emit('reply', {comment_id: comment._id, to: comment.user})">
        Ответить
      </button>
      <button @click="emit('actSubComments')" class="item__replies-btn mr-2" v-if="comment.repliesCount">
        Ответы {{comment.repliesCount}}
      </button>
    </div>
    <div class="d-flex align-items-center ml-auto">
      <span class="item__date " v-if="!comment.isEdited">{{formatShortDate(comment.createdAt)}}</span>
      <span class="item__date " v-else>{{ `[изменено ${formatShortDate(comment.updatedAt)}]` }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">

.item__actions{
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  .exact__actions{
    display: flex;
    gap: 10px;
    align-items: center;
  }
}

.item__replies-btn {
  opacity: 0.8;
  font-size: 12px;
  font-weight: 500;
  color: #4CAF50;
}
.item__date {
  opacity: 0.8;
  font-size: 12px;
  font-weight: 500;
  color: gray;
}
</style>