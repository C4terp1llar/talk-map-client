<script setup lang="ts">
import PostEditorText from "@/components/posts/postEditorText.vue";
import MediaUpload from "@/components/multimedia/mediaUpload.vue";
import {onMounted, onUnmounted, ref} from "vue";
import {usePostStore} from "@/stores/post";
import {useNotificationStore} from "@/stores/notifications";
import {onClickOutside} from "@vueuse/core";
import {lockScroll, unlockScroll} from "@/helpers/popup";

const emit = defineEmits(["close"]);

interface PostF { id: string, file: File, previewUrl?: string, type: string }

const postStore = usePostStore();
const ntfStore = useNotificationStore();

const postFiles = ref<PostF[]>([]);
const postText = ref<string>('');

const handlePost = async () => {
  if (!postText.value.trim().length) return;

  let mediaData
  if (postFiles.value.length > 0){
    const formData = new FormData();
    postFiles.value.forEach(fileEntry => {
      formData.append(fileEntry.file.name, fileEntry.file);
    });
    mediaData = formData
  }

  emit('close');

  await postStore.createPost(postText.value, mediaData, [{key: 'sender', value: 'post'}]);

  if (postStore.error){
    ntfStore.addNotification('error', postStore.error, 3000)
  }else{
    ntfStore.addNotification('success', 'Пост успешно опубликован!', 3000)
    await postStore.getPosts('load', undefined, undefined, true)
  }
}

const postEditor = ref<HTMLElement | null>(null);

const clickOutside = () => {
  emit('close');
};
onClickOutside(postEditor, clickOutside);

onMounted(() => lockScroll())
onUnmounted(() => unlockScroll())
</script>

<template>
  <div class="post-editor__gl-wrapper">
    <div ref="postEditor" class="post-editor__wrapper">
      <button class="close-u-m__btn" @click="emit('close')">
        <v-icon class="desktop_icon" :size="24" >mdi-close</v-icon>
        <div class="mobile_icon">
          <v-icon :size="24" color="green">mdi-arrow-left-bold-outline</v-icon>
          <span>Назад</span>
        </div>
      </button>

      <h6 class="text-center">Создание поста</h6>

      <media-upload @sl-post-media="(m: PostF[] | []) => postFiles = m" sender="post"/>
      <post-editor-text v-model="postText"/>

      <div class="actions">
        <v-btn @click="handlePost" color="green" class="text-none w-100" variant="text">Опубликовать</v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.post-editor__gl-wrapper {
  position: fixed;
  inset: 0;
  z-index: 10003;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.post-editor__wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  box-shadow: 0 1px 10px currentColor;
  border-radius: 15px;
  background: rgb(var(--v-theme-background));
  padding: 15px;

  width: 80vw;

  @media screen and (max-width: 650px) {
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    padding: 5px;
  }
}
</style>
