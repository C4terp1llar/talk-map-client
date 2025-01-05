<script setup lang="ts">
import TextDivider from "@/components/common/textDivider.vue";
import {usePostStore} from "@/stores/post";
import {useNotificationStore} from "@/stores/notifications";
import {computed, onMounted, ref} from "vue";
import CreateComment from "@/components/posts/createComment.vue";
import type {UserComment} from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import CommentsSkeleton from "@/components/skeletons/commentsSkeleton.vue";
import CommentsNotFound from "@/components/posts/commentsNotFound.vue";
import CommentItem from "@/components/posts/commentItem.vue";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";

interface Props {
  entityType: 'Publication' | 'Post' | 'Comment',
  entityId: string,
  mode: 'internal' | 'external',
  parentCommentId?: string,
  repliesMode?: boolean,
  isGlobal?: boolean;
}

const props = defineProps<Props>();

const currentPage = ref<number>(1);
const LIMIT = 15

const postStore = usePostStore();
const nthStore = useNotificationStore();

onMounted(async () => {
  await getComments(props.repliesMode ? 'replies' : 'comments', 'load');
})

const comments = ref<UserComment[] | null>(null);
const hasMore = ref<boolean>(false);
const pending = ref<boolean>(false);
const pendingMore = ref<boolean>(false);

const getComments = async (mode: 'comments' | 'replies', pendMode: 'load' | 'loadMore') => {
  if (mode === 'replies' && !props.parentCommentId) return;

  const currentPending = pendMode === 'load' ? pending : pendingMore;
  currentPending.value = true;

  const data = await postStore.getComments(mode, props.entityType, props.entityId, currentPage.value, LIMIT, props.parentCommentId);

  currentPending.value = false;

  if (data.comments){
    comments.value = data.comments;
    hasMore.value = data.hasMore;
  }

  if (postStore.commentError){
    nthStore.addNotification('error', postStore.commentError, 3000);
  }
}

const moreFlag = computed(() => {
  return (
      comments.value &&
      comments.value.length === LIMIT * currentPage.value &&
      hasMore.value &&
      !pending.value &&
      !pendingMore.value
  )
})

const replyModel = ref<{comment_id: string, to: { _id: string; nickname: string; nickname_color: string | null; avatar: string}} | null>(null)

//mode: 'comments' | 'replies', entityType: 'Publication' | 'Post' | 'Comment', entityId: string, page: number = 1, limit: number = 15, parentCommentId?: string
</script>

<template>
  <div :class="['comments-list__wrapper']">
    <text-divider v-if="!repliesMode" text="Комментарии"/>

    <comments-skeleton v-if="pending"/>

    <div :class="['comment-items__wrapper styled-scroll__np', props.repliesMode ? ' __replies' : ' mt-2 mb-2', props.isGlobal ? '__global' : '']" v-if="!pending && comments && comments.length">

      <comment-item class="mt-1 mb-1"
                    v-for="c in comments"
                    :key="c._id" :comment="c"
                    :mode="props.mode" :entity-id="props.entityId"
                    :entity-type="props.entityType" :parent-comment-id="props.parentCommentId"
                    @reply="payload => replyModel = payload"
                    :replies-mode="props.repliesMode"
      />

      <v-btn v-if="moreFlag && !pendingMore" color="green" class="text-none mb-1" variant="text">
        Еще
      </v-btn>

      <pagination-dot-loader class="mt-1" v-if="pendingMore"/>
    </div>

    <comments-not-found v-if="!pending && (!comments || !comments.length)"/>

    <create-comment v-if="!pending && !repliesMode"
                    :reply="replyModel" :mode="props.mode"
                    :entity-id="props.entityId" :entity-type="props.entityType"
                    :parent-comment-id="props.parentCommentId"
                    @clear-reply="replyModel = null"
                    class="create__comment"
    />
  </div>
</template>

<style scoped lang="scss">
.comments-list__wrapper{
  padding: 5px 0 0 0;
}

.comment-items__wrapper{
  display: flex;
  flex-direction: column;
  &:not(.__replies,.__global){
    max-height: 400px;
    overflow: auto;
  }
}

.create__comment{
  position: sticky;
  bottom: 0;
  background: rgb(var(--v-theme-background));
  padding-top: 5px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;

}


</style>