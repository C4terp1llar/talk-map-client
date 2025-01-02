<script setup lang="ts">
import TextDivider from "@/components/common/textDivider.vue";
import {usePostStore} from "@/stores/post";
import {useNotificationStore} from "@/stores/notifications";
import {onMounted, ref} from "vue";
import CreateComment from "@/components/posts/createComment.vue";

interface Props {
  entityType: 'Publication' | 'Post' | 'Comment',
  entityId: string,
  mode: 'internal' | 'external',
  parentCommentId?: string
}

const props = defineProps<Props>();

const currentPage = ref<number>(1);
const LIMIT = 15

const postStore = usePostStore();
const nthStore = useNotificationStore();

onMounted(async () => {
  await getComments('comments');
})

const getComments = async (mode: 'comments' | 'replies') => {
  await postStore.getComments(mode, props.entityType, props.entityId, currentPage.value, LIMIT, props.parentCommentId);

  if (postStore.commentError){
    nthStore.addNotification('error', postStore.commentError, 3000);
  }
}

//mode: 'comments' | 'replies', entityType: 'Publication' | 'Post' | 'Comment', entityId: string, page: number = 1, limit: number = 15, parentCommentId?: string
</script>

<template>
  <div class="comments-list__wrapper">
    <text-divider text="Комментарии"/>

    <h5>тут либо комменты ли комментов нет</h5>

    <create-comment :mode="props.mode" :entity-id="props.entityId" :entity-type="props.entityType" :parent-comment-id="props.parentCommentId"/>
  </div>
</template>

<style scoped lang="scss">
.comments-list__wrapper{
  padding: 5px 0 0 0;
}
</style>