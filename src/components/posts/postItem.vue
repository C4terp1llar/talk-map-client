<script setup lang="ts">
import type { Post } from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import PostReactions from "@/components/posts/postReactions.vue";
import {ref} from "vue";
import PostItemHead from "@/components/posts/postItemHead.vue";
import CommentsList from "@/components/posts/commentsList.vue";

interface Props {
  p: Post;
  mode: 'internal' | 'external';
}

const props = defineProps<Props>();

const currentMedia = ref<number>(0);

const isCommentsVisible = ref<boolean>(false);
const handleActComments = () => {
  isCommentsVisible.value = !isCommentsVisible.value;
}
</script>

<template>
  <div class="posts-item__wrapper">

    <post-item-head :post="props.p" :mode="props.mode" />

    <div class="post-item-media__wrapper mt-2" v-if="p.media && p.media.length">
      <v-carousel :height="250" :show-arrows="p.media.length > 1" hide-delimiters class="media__slider" @update:model-value="i => typeof i === 'number' ? currentMedia = i : currentMedia = 0">
        <v-carousel-item
            v-for="(m, index) in p.media"
            :key="m.id"
            :value="index"
        >

          <div v-if="m.type.startsWith('image/')" class="post-item-media__img">
            <v-img  :src="m.url" :alt="'Image ' + index">
              <template v-slot:placeholder>
                <skeleton-loader />
              </template>
            </v-img>
          </div>

          <div v-if="m.type.startsWith('video/')" class="post-item-media__video">
            <video style=" max-height: 100%; object-fit: contain;" :src="m.url" controls></video>
          </div>
        </v-carousel-item>
      </v-carousel>
      <span v-if="p.media.length > 1" class="mt-1 media__counter">{{ `${currentMedia + 1} из ${p.media.length}` }}</span>
    </div>

    <div class="post-item__text mt-2">
      <h6>{{ p.text }}</h6>
    </div>

    <div class="post-item__reactions">
      <post-reactions @act-comments="handleActComments" :post="p"/>
    </div>

    <comments-list :mode="props.mode" :entity-id="p._id" entity-type="Post" v-if="isCommentsVisible"/>
  </div>
</template>

<style scoped lang="scss">
.posts-item__wrapper {
  width: 100%;
  padding: 10px;
  box-shadow: 0 1px 10px currentColor;
  border-radius: 15px;
  background: rgb(var(--v-theme-background));


  .post-item-media__wrapper{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    .post-item-media__video, .post-item-media__img{
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

  }


}

.media__counter {
  opacity: 0.8;
  font-size: 12px;
  font-weight: 500;
  color: grey;
}

img, video{
  border-radius: 5px !important;
}
</style>
