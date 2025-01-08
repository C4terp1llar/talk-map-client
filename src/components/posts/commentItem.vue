<script setup lang="ts">
import type {UserComment} from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {formatShortDate} from "../../helpers/dateHelper";
import SubCommentsList from "@/components/posts/subCommentsList.vue";
import {computed, ref} from "vue";
import CommentsList from "@/components/posts/commentsList.vue";
import {usePostStore} from "@/stores/post";

const emit = defineEmits<{
  (e: 'reply', payload: {comment_id: string, to: { _id: string; nickname: string; nickname_color: string | null; avatar: string}}): void,
  (e: 'actSubComments', payload: {comment_id: string}): void,
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

const isSubsComments = ref<boolean>(props.isGlobal && props.comment.repliesCount > 0);
</script>

<template>
  <div class="comment-items__content">

    <div class="item__avatar">
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
      </div>

      <div class="item__text">
        <span>{{props.comment.text}}</span>
      </div>

      <div class="item__actions">
        <div class="exact__actions" v-if="!props.repliesMode">
          <button class="item__replies-btn" @click="emit('reply', {comment_id: comment._id, to: comment.user})">
            Ответить
          </button>
          <button @click="isSubsComments = !isSubsComments" class="item__replies-btn" v-if="comment.repliesCount">
            Ответы {{comment.repliesCount}}
          </button>
        </div>
        <span class="item__date">{{formatShortDate(comment.createdAt)}}</span>
      </div>


      <sub-comments-list
          v-if="isSubsComments"
          :mode="props.mode" :entity-type="props.entityType" :parent-comment-id="comment._id"
          :entity-id="props.entityId" :replies-mode="true" :is-global="props.isGlobal"
          :replies-count="props.comment.repliesCount"
      />

<!--      <comments-list v-if="isSubsComments" -->
<!--                     :mode="props.mode" :entity-type="props.entityType" :parent-comment-id="comment._id"-->
<!--                     :entity-id="props.entityId" :replies-mode="true"-->
<!--      />-->
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

  .item__actions{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .exact__actions{
      display: flex;
      gap: 10px;
      align-items: center;
    }
  }
}

.item__text{
  font-size: 14px;
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