<script setup lang="ts">
import {usePostStore} from "@/stores/post";
import {ref} from "vue";
import PostEditor from "@/components/posts/postEditor.vue";

const postStore = usePostStore();

const isCreate = ref<boolean>(false);
const handleClose = () => {
  setTimeout(() => {
    isCreate.value = false;
  });
};
</script>

<template>
  <div class="create-post__wrapper">
    <div class="create-post__content">
      <h5 class="ma-0">Опубликовать пост</h5>
      <v-icon class="icon-tag-cover">mdi-post</v-icon>
      <button @click="isCreate = true" :disabled="postStore.pending"></button>
    </div>
  </div>
  <post-editor v-if="isCreate" @close="handleClose"/>
</template>

<style scoped lang="scss">
.create-post__wrapper{
  width: 100%;
  background: linear-gradient(
          150deg,
          red,
          orange,
          yellow,
          green,
          blue,
          indigo,
          violet
  );
  padding: 2px;
  border-radius: 15px;
  position: relative;
  overflow: hidden;

  .create-post__content{
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 10px;
    align-items: center;
    width: 100%;
    background-color: rgb(var(--v-theme-background));
    border-radius: 13px;

    transition: .3s;

    .icon-tag-cover, h5{
      transition: .3s;

    }

    &:hover{
      filter: brightness(0.95);
      .icon-tag-cover, h5{
        filter: drop-shadow(0 0 3px currentColor);
      }
    }
  }

  button{
    position: absolute;
    inset: 0;
  }
}
</style>