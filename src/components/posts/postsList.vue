<script setup lang="ts">
import {usePostStore} from "@/stores/post";
import {useNotificationStore} from "@/stores/notifications";
import {computed, onMounted, onUnmounted} from "vue";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";
import PhotosListItem from "@/components/photos/photosListItem.vue";
import PhotosNotFound from "@/components/photos/photosNotFound.vue";
import PostItem from "@/components/posts/postItem.vue";
import PostListSkeleton from "@/components/skeletons/postListSkeleton.vue";

interface Props {
  mode: 'internal' | 'external',
  uid?: string,
  short?: boolean,
  withoutPreload?: boolean,
}

const props = defineProps<Props>()

const postStore = usePostStore();
const notificationStore = useNotificationStore()

onMounted(async () => {
  if (!props.withoutPreload){
    await uploadData('load')
  }
})

onUnmounted(async () => {
  postStore.posts = null;
  postStore.postOwnerInfo = null;
  postStore.hasMore = false;
  postStore.postPage = 1;
})

const moreFlag = computed(() => {
  return (
      postStore.posts &&
      postStore.posts.length === postStore.perPage * postStore.postPage &&
      postStore.hasMore &&
      !postStore.load &&
      !postStore.loadMore
  )
})

const uploadData = async (mode: 'load' | 'load-more') => {
  if (!moreFlag && mode === 'load-more') return

  let requester

  if (props.mode == 'external' && props.uid) {
    requester = props.uid
  }

  await postStore.getPosts(mode, props.short ? 5 : undefined, requester)

  if (postStore.postsError) {
    notificationStore.addNotification('error', postStore.postsError, 3000)
  }
}
</script>

<template>
  <div class="posts-list__wrapper">
    <post-list-skeleton v-if="postStore.load "/>

    <div class="post-list__content-wrapper" v-if="!postStore.load && postStore.posts && postStore.posts.length">

      <div :class="['post-list__content', props.short ? '__short' : '']">
        <post-item :mode="props.mode" v-for="post in postStore.posts" :key="post._id" :p="post"/>
      </div>

      <div class="controls  mt-1 d-flex justify-content-center">
        <v-btn
            color="green"
            class="text-none"
            variant="text"
            @click="uploadData('load-more')"
            v-if="moreFlag"
        >
          Еще
        </v-btn>
      </div>

      <pagination-dot-loader class="mt-1" v-if="postStore.loadMore"/>
    </div>

<!--    <photos-not-found class="align-self-center" v-if="!postStore.load && postStore.posts && !postStore.posts.length"/>-->
  </div>
</template>

<style scoped lang="scss">
.posts-list__wrapper{
  width: 100%;

  .post-list__content-wrapper{
    display: flex;
    flex-direction: column;
    gap: 10px;
    .post-list__content{
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
}
</style>