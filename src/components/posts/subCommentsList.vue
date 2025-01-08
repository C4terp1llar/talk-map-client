<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {usePostStore} from "@/stores/post";
import {useNotificationStore} from "@/stores/notifications";
import type {UserComment} from "@/helpers/interfaces";
import CommentsNotFound from "@/components/posts/commentsNotFound.vue";
import CommentsSkeleton from "@/components/skeletons/commentsSkeleton.vue";
import TextDivider from "@/components/common/textDivider.vue";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";
import CreateComment from "@/components/posts/createComment.vue";
import CommentItem from "@/components/posts/commentItem.vue";

const emit = defineEmits<{
  (e: 'exactDeleteReply', payload: {comment_id: string}): void
}>()

interface Props {
  entityType: 'Publication' | 'Post' | 'Comment',
  entityId: string,
  mode: 'internal' | 'external',
  parentCommentId: string,
  repliesCount: number,
  repliesMode?: boolean,
  isGlobal?: boolean;
}


const props = defineProps<Props>();

const currentPage = ref<number>(1);
const LIMIT = 15

const postStore = usePostStore();
const nthStore = useNotificationStore();

onMounted(async () => {
  await getComments( 'load');

  watch(
      () => props.repliesCount,
      async (newValue) => {
        await getComments('load', true);
      }
  );
})

const comments = ref<UserComment[] | null>(null);
const hasMore = ref<boolean>(false);
const pending = ref<boolean>(false);
const pendingMore = ref<boolean>(false);

const getComments = async (pendMode: 'load' | 'loadMore', withoutPending?: boolean) => {
  let currentPending
  if (!withoutPending){
    currentPending = pendMode === 'load' ? pending : pendingMore;
    currentPending.value = true;
  }

  const data = await postStore.getComments('replies', props.entityType, props.entityId, currentPage.value, LIMIT, props.parentCommentId);

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

const deleteReply = async (payload: {comment_id: string}) => {
  await getComments('load', true);
  emit('exactDeleteReply', {comment_id: props.parentCommentId});
}


</script>

<template>
  <div class="comments-list__wrapper">
    <comments-skeleton v-if="pending"/>

    <div class="comment-items__wrapper__replies mt-2 mb-2" v-if="!pending && comments && comments.length">

      <comment-item class="mt-1 mb-1"
                    v-for="c in comments"
                    :id="c._id"
                    :key="c._id" :comment="c"
                    :mode="props.mode" :entity-id="props.entityId"
                    :entity-type="props.entityType" :parent-comment-id="props.parentCommentId"
                    :replies-mode="repliesMode" @delete-reply="payload => deleteReply(payload)"
      />

      <v-btn v-if="moreFlag && !pendingMore" color="green" class="text-none mb-1" variant="text">
        Еще
      </v-btn>

      <pagination-dot-loader class="mt-1" v-if="pendingMore"/>
    </div>

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