<script setup lang="ts">
import type {UserComment} from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {formatShortDate} from "../../helpers/dateHelper";
import SubCommentsList from "@/components/posts/subCommentsList.vue";
import {computed, ref} from "vue";
import CommentsList from "@/components/posts/commentsList.vue";
import {usePostStore} from "@/stores/post";
import CommentItemActions from "@/components/posts/commentItemActions.vue";
import CommentItemInternalActions from "@/components/posts/commentItemInternalActions.vue";
import CreateComment from "@/components/posts/createComment.vue";
import ChangeComment from "@/components/posts/changeComment.vue";

const emit = defineEmits<{
  (e: 'reply', payload: {comment_id: string, to: { _id: string; nickname: string; nickname_color: string | null; avatar: string}}): void,
  (e: 'actSubComments', payload: {comment_id: string}): void,
  (e: 'deleteComment', payload: {comment_id: string, act: 'deleted' | 'markDelete'}): void,
  (e: 'deleteReply', payload: {comment_id: string}): void,
  (e: 'exactDeleteReply', payload: {comment_id: string}): void,
  (e: 'commentUpdated', payload: {comment_id: string, newText: string, updated: Date}): void,
}>();

interface Props {
  comment: UserComment,
  entityType: 'Publication' | 'Post' | 'Comment',
  entityId: string,
  mode: 'internal' | 'external',
  parentCommentId?: string,
  repliesMode?: boolean,
  isGlobal?: boolean;
}

const props = defineProps<Props>();

const isSubsComments = ref<boolean>(props.isGlobal);

const handleDeleteComment = (payload: {mode: 'comment' | 'reply', comment_id: string, act: 'deleted' | 'markDelete' }) => {
  if (payload.mode === 'comment') {
    emit('deleteComment', {comment_id: payload.comment_id, act: payload.act})
  }else{
    emit('deleteReply', {comment_id: payload.comment_id})
  }
}

const isChangeMode = ref<boolean>(false);

const updateComment = (payload: {comment_id: string, newText: string, updated: Date}) => {
  isChangeMode.value = !isChangeMode.value;
  props.comment.isEdited = true;
  props.comment.text = payload.newText;
  props.comment.updatedAt = payload.updated;
  //
  // emit('commentUpdated', payload)
}
</script>

<template>
  <div class="comment-items__content">

    <div class="item__avatar" >
      <v-avatar>
        <v-img
            :src="comment.user.avatar"
            alt="avatar"
            cover
        >
          <template v-slot:placeholder>
            <skeleton-loader/>
          </template>
          <router-link :to="{ name: 'friends-user', params: { id: props.comment.user._id } }"/>
        </v-img>
      </v-avatar>
    </div>

    <div class="item__content">

      <div class="item__nickname">
        <router-link
            :style="{color: props.comment.user.nickname_color ? props.comment.user.nickname_color : 'currentColor'}"
            class="nickname-txt"
            :to="{ name: 'friends-user', params: { id: props.comment.user._id } }"
        >{{ props.comment.user.nickname }}
        </router-link>

        <comment-item-internal-actions
            v-if="comment.mode === 'internal' && !comment.isDeleted" :entity-type="props.entityType" @delete-comment="payload => handleDeleteComment(payload)"
            :mode="parentCommentId ? 'reply' : 'comment'" :comment="props.comment" :entityId="props.entityId" @change-comment="isChangeMode = !isChangeMode"
        />
      </div>

      <div class="item__text" v-if="!isChangeMode">
        <span v-if="!comment.isDeleted">{{props.comment.text}}</span>
        <div v-else class="deleted-comment">
          <span>Комментарий удален</span>
          <v-icon color="warning">mdi-delete-empty-outline</v-icon>
        </div>
      </div>
      <change-comment v-else @act-change-comment="isChangeMode = !isChangeMode" :entity-type="props.entityType"
                      :entityId="props.entityId" :mode="props.mode" :text="comment.text" :comment_id="comment._id"
                      @comment-updated="payload => updateComment(payload)"
      />

      <comment-item-actions
          v-if="!isChangeMode"
          @act-sub-comments="isSubsComments = !isSubsComments" @reply="payload => emit('reply', payload)"
          :comment="props.comment" :entityId="props.entityId" :mode="props.mode"
          :parentCommentId="props.parentCommentId" :repliesMode="props.repliesMode"
      />


      <sub-comments-list
          v-if="isSubsComments"
          :mode="props.mode" :entity-type="props.entityType" :parent-comment-id="comment._id"
          :entity-id="props.entityId" :replies-mode="true" :is-global="props.isGlobal"
          :replies-count="props.comment.repliesCount" @exact-delete-reply="payload => emit('exactDeleteReply', {comment_id: payload.comment_id})"
      />

    </div>
  </div>

</template>

<style scoped lang="scss">
.comment-items__content{
  border: 1px solid gray;
  border-radius: 5px;
  background: rgb(var(--v-theme-background));
  padding: 5px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;

}

.item__text{
  font-size: 14px;
}

.item__nickname{

  display: flex;
  align-items: center;
  justify-content: space-between;

}

.deleted-comment{
  color: orange;
  display: flex;
  align-items: center;
  gap: 5px;
}


</style>