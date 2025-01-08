<script setup lang="ts">
import TextDivider from "@/components/common/textDivider.vue";
import {usePostStore} from "@/stores/post";
import {useNotificationStore} from "@/stores/notifications";
import {computed, onMounted, ref, setDevtoolsHook} from "vue";
import CreateComment from "@/components/posts/createComment.vue";
import type {UserComment} from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import CommentsSkeleton from "@/components/skeletons/commentsSkeleton.vue";
import CommentsNotFound from "@/components/posts/commentsNotFound.vue";
import CommentItem from "@/components/posts/commentItem.vue";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";
import {useRoute} from "vue-router";

const emit = defineEmits(['incCommentsCount', 'decCommentsCount', 'showSubComments'])
const route = useRoute();

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

const getComments = async (mode: 'comments' | 'replies', pendMode: 'load' | 'loadMore', withoutPending?: boolean) => {
  if (mode === 'replies' && (!props.parentCommentId || !parent)) return;

  let currentPending
  if (!withoutPending){
    currentPending = pendMode === 'load' ? pending : pendingMore;
    currentPending.value = true;
  }

  const data = await postStore.getComments(mode, props.entityType, props.entityId, currentPage.value, LIMIT, props.parentCommentId);

  if (!withoutPending && currentPending){
    currentPending.value = false;
  }

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

const reloadComments = async (mode: 'comments' | 'replies') => {

  if(mode === 'replies' && replyModel.value?.comment_id){
    decIncReplies('inc', replyModel.value?.comment_id)
  }

  await getComments(mode, 'load', true)
  decIncComments('inc')
}

const handleDeleteComment = async (payload: {comment_id: string, act: 'deleted' | 'markDelete'}) => {
  await getComments('comments', 'load', true)

  if (payload.act === 'deleted'){
    decIncComments('dec')
  }
}

const handleDeleteReply = async (payload: {comment_id: string}) => {
  decIncReplies('dec', payload.comment_id);
  decIncComments('dec')

  if (comments.value){
    const index = comments.value.findIndex(i => i._id === payload.comment_id)
    if(index !== -1){
      if(comments.value[index].repliesCount <= 0 && comments.value[index].isDeleted){
        await getComments('comments', 'load', true)
        decIncComments('dec')
      }
    }
  }
}

const decIncComments = (mode: 'dec' | 'inc') => {
  if(route.query.p && postStore.posts && postStore.posts.length) {
    const index = postStore.posts.findIndex(i => i._id === props.entityId)
    if(index !== -1){
      postStore.posts[index].comments_count += mode === 'inc' ? 1 : -1;
    }
  }
  emit(`${mode}CommentsCount`)
}

const decIncReplies = (mode: 'dec' | 'inc', commentId: string) => {
  if(comments.value){
    const index = comments.value.findIndex(i => i._id === commentId)
    if(index !== -1){
      comments.value[index].repliesCount += mode === 'inc' ? 1 : -1;
    }
  }
}


</script>

<template>
  <div :class="['comments-list__wrapper']">
    <text-divider v-if="!repliesMode" text="Комментарии"/>

    <comments-skeleton v-if="pending"/>

    <div :class="['comment-items__wrapper styled-scroll__np', props.repliesMode ? ' __replies' : ' mt-2 mb-2', props.isGlobal ? '__global' : '']" v-if="!pending && comments && comments.length">

      <comment-item class="mt-1 mb-1"
                    v-for="c in comments"
                    :id="c._id"
                    :key="c._id" :comment="c"
                    :mode="props.mode" :entity-id="props.entityId"
                    :entity-type="props.entityType" :parent-comment-id="props.parentCommentId"
                    @reply="payload => replyModel = payload"
                    :replies-mode="props.repliesMode"
                    :is-global="props.isGlobal"
                    @delete-comment="payload => handleDeleteComment(payload)"
                    @exact-delete-reply="payload => handleDeleteReply(payload)"
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
                    @reload-comments="md => reloadComments(md)"
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