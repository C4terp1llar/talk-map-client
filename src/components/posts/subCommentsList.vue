<script setup lang="ts">
import {onMounted, ref} from "vue";
import {usePostStore} from "@/stores/post";
import {useNotificationStore} from "@/stores/notifications";
import type {UserComment} from "@/helpers/interfaces";

interface Props {
  entityType: 'Publication' | 'Post' | 'Comment',
  entityId: string,
  mode: 'internal' | 'external',
  parentCommentId: string
}

const props = defineProps<Props>();

const currentPage = ref<number>(1);
const LIMIT = 15

const postStore = usePostStore();
const nthStore = useNotificationStore();

onMounted(async () => {
  await getComments('replies', 'load');
})

const comments = ref<UserComment[] | null>(null);
const hasMore = ref<boolean>(false);
const pending = ref<boolean>(false);
const pendingMore = ref<boolean>(false);

const getComments = async (mode: 'comments' | 'replies', pendMode: 'load' | 'loadMore') => {
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

</script>

<template>
  <div class="sub-comments-list__wrapper">

  </div>
</template>

<style scoped lang="scss">

</style>