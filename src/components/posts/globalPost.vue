<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {lockScroll, unlockScroll} from "@/helpers/popup";
import {useNotificationStore} from "@/stores/notifications";
import {usePostStore} from "@/stores/post";
import {useRoute, useRouter} from "vue-router";
import type {Post, PostOwner} from "@/helpers/interfaces";
import PostItem from "@/components/posts/postItem.vue";
import {onClickOutside} from "@vueuse/core";
import GPhotoContentSkeleton from "@/components/skeletons/gPhotoContentSkeleton.vue";
import PostNotFound from "@/components/posts/postNotFound.vue";

const postStore = usePostStore();
const ntfStore = useNotificationStore();

const route = useRoute();
const router = useRouter();

const currentPost = ref<Post | null>(null);
const currentMode = ref<'internal' | 'external' | null>(null);
const currentPostOwner = ref<PostOwner | null>(null)

const pending = ref(false)



onMounted(async () => {
  document.documentElement.style.overflow = 'hidden';
  lockScroll();
  if (!route.query.p || typeof route.query.p !== 'string') return

  pending.value = true
  const {posts, ownerInfo} = await postStore.getPost(route.query.p)

  if (posts && posts.length && ownerInfo){
    currentPost.value = posts[0];
    currentPostOwner.value = ownerInfo;
    currentMode.value = currentPost.value.mode;
  }else{
    currentPost.value = null;
    currentPostOwner.value = null;
    currentMode.value = null;
  }
  pending.value = false

  if (postStore.postsError) {
    ntfStore.addNotification('error', postStore.postsError, 3000)
  }
})

onUnmounted(() => {
  document.documentElement.style.overflow = '';
  unlockScroll()
})


const postContentRef = ref<HTMLElement | null>(null);
const clickOutside = () => {
  setTimeout(() => {router.push({query: {p: undefined}})})
};
onClickOutside(postContentRef, clickOutside);
</script>

<template>
  <div class="g-post__wrapper ">
    <div class="post-content__wrapper" ref="postContentRef">
      <post-item
          class="exact-post"
          @delete-post="router.push({query: {p: undefined}})"
          v-if="currentPostOwner && currentPost && currentMode && !pending"
          :is-global="true" :post-owner-info="currentPostOwner"
          :p="currentPost" :mode="currentMode"
      />
      <post-not-found class="post-not-found" v-if="(!currentPostOwner || !currentPost || !currentMode) && !pending"/>
      <g-photo-content-skeleton class="loader" v-if="pending"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.g-post__wrapper {
  position: fixed;
  inset: 0;
  z-index: 10003;
  width: 100%;
  height: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  overflow-y: scroll;

  .post-content__wrapper{
    width: 80vw;
    @media screen and (max-width: 650px) {
      width: calc(100vw - 10px);
    }
    box-shadow: 0 1px 10px currentColor;
    border-radius: 15px;
    background: rgb(var(--v-theme-background));
    margin: 5px 0 5px 0;
  }

}
.loader{
  height: 50vh;
  padding: 10px 5px 15px 5px;
}
.post-not-found{
  padding: 20px;
}
</style>