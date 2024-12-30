<script setup lang="ts">
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {usePostStore} from "@/stores/post";
import CircularLoader from "@/components/common/circularLoader.vue";
import type {Post} from "@/helpers/interfaces";
import {ref} from "vue";
import {useNotificationStore} from "@/stores/notifications";

interface Props {
  post: Post,
  mode: 'internal' | 'external';
}

const props = defineProps<Props>();
const postStore = usePostStore();
const ntfStore = useNotificationStore();

const currentDeletePending = ref<string>('')

const deletePost = async (id: string) => {
  if (postStore.delPostPending) return;
  currentDeletePending.value = id

  await postStore.deletePost(id);

  if (postStore.delPostError){
    ntfStore.addNotification('error', postStore.delPostError, 3000)
  }else{
    ntfStore.addNotification('success', 'Пост успешно удален!', 3000)
    await postStore.getPosts('load', undefined, undefined, true)
  }

  currentDeletePending.value = '';
}
</script>

<template>
<div class="post-item__head">

  <div class="owner__info">
    <v-avatar class="post-owner__avatar">
      <v-img :src="postStore.postOwnerInfo?.avatar" alt="avatar" cover>
        <template v-slot:placeholder>
          <skeleton-loader/>
        </template>
        <router-link area-disabled :to="{ name: 'friends-user', params: { id: postStore.postOwnerInfo?._id } }"/>
      </v-img>
    </v-avatar>

    <div class="post-owner__nickname">
      <router-link
          :style="{color: postStore.postOwnerInfo?.nickname_color ? postStore.postOwnerInfo?.nickname_color : 'currentColor'}"
          class="nickname-txt"
          :to="{ name: 'friends-user', params: { id: postStore.postOwnerInfo?._id } }"
      >
        {{ postStore.postOwnerInfo?.nickname }}
      </router-link>
    </div>
  </div>

  <div class="post__actions" v-if="props.mode === 'internal' && postStore.postOwnerInfo?.match">
    <button :disabled="postStore.delPostPending" @click="deletePost(post._id)" class="delete-img">
      <v-icon :size="20" v-if="currentDeletePending !== post._id" color="red">mdi-trash-can-outline</v-icon>
      <circular-loader :size="20" v-if="currentDeletePending === post._id"/>
    </button>
  </div>
</div>
</template>

<style scoped lang="scss">
.post-item__head{
  display: flex;
  align-items: center;
  justify-content: space-between;

  .owner__info{
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .post__actions{
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.post-owner__avatar{
  a {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    z-index: 1 !important;
  }
}

.nickname-txt {
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-height: 1.2em;
}

.delete-img {
  opacity: .7;
  transition: 0.3s;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 1;
  }
}

</style>