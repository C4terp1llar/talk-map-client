<script setup lang="ts">
import {useRouter} from "vue-router";
import type {Post, PostOwner} from "@/helpers/interfaces";
import {ref} from "vue";
import {onClickOutside} from "@vueuse/core";
import {usePostStore} from "@/stores/post";
import {useNotificationStore} from "@/stores/notifications";

const postStore = usePostStore();
const ntfStore = useNotificationStore();

const router = useRouter();
const emit = defineEmits(['deletePost'])

interface Props {
  post: Post,
  postOwnerInfo: PostOwner;
  mode: 'internal' | 'external';
  isGlobal?: boolean;
}

const props = defineProps<Props>();

const postMenuRef = ref<HTMLElement | null>(null);
const isPostMenuVisible = ref(false);
const clickOutside = () => {
  setTimeout(() => {isPostMenuVisible.value = false})
};
onClickOutside(postMenuRef, clickOutside);

const handleMenuClick = async () => {
  if (props.mode === 'internal') {
    isPostMenuVisible.value = true
  }else if (props.mode === 'external' && !props.isGlobal) {
    await handleMenuClickAction('open')
  }else{
    await router.push({query: {p: undefined}})
  }
}

const handleMenuClickAction = async (act: 'delete' | 'open') => {
  if (act === 'delete'){
    await deletePost(props.post._id)
  }else{
    await router.push({query: {p: props.post._id}})
  }
  isPostMenuVisible.value = false;
}

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
    emit('deletePost')
  }

  currentDeletePending.value = '';
}

</script>

<template>
  <div class="post__actions">
    <button
        class="more__btn"
        @click="handleMenuClick"
        :disabled="postStore.delPostPending"
    >
      <v-icon v-if="mode === 'internal'" :size="20">mdi-dots-horizontal</v-icon>
      <v-icon v-else-if="mode === 'external' && !isGlobal"  :size="20">mdi-open-in-new</v-icon>
      <v-icon v-else :size="20">mdi-close</v-icon>
    </button>

    <div class="post-actions__menu" v-if="isPostMenuVisible" ref="postMenuRef">

      <v-btn
          variant="text"
          class="text-none w-100 justify-content-start"
          prepend-icon="mdi-open-in-new"
          :disabled="postStore.delPostPending"
          @click="handleMenuClickAction('open')"
          v-if="!isGlobal"
      >
        Открыть
      </v-btn>

      <v-btn
          variant="text"
          class="text-none w-100 justify-content-start"
          prepend-icon="mdi-delete-outline"
          :disabled="postStore.delPostPending"
          @click="handleMenuClickAction('delete')"
          :loading="currentDeletePending === post._id"
          v-if="mode === 'internal'"
      >
        Удалить
      </v-btn>

      <v-btn
          variant="text"
          class="text-none w-100 justify-content-start"
          prepend-icon="mdi-close"
          :disabled="postStore.delPostPending"
          @click="router.push({query: {p: undefined}})"
          v-if="mode === 'internal' && isGlobal"
      >
        Закрыть
      </v-btn>
    </div>

  </div>
</template>

<style scoped lang="scss">
.post__actions{
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .post-actions__menu{
    z-index: 10;
    position: absolute;
    right: 0;
    top: 105%;
    padding: 7px;
    border-radius: 15px;
    box-shadow: 0 1px 10px currentColor;
    background: rgb(var(--v-theme-background));
  }
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

.more__btn{
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 5px;
  transition: 0.3s;

  &:hover {
    filter: drop-shadow(0 0 2px currentColor);
  }
}
</style>