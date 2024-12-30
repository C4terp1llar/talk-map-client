<script setup lang="ts">
import type { Post } from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import PostReactions from "@/components/posts/postReactions.vue";
import {VideoPlayer} from "@videojs-player/vue";
import {ref} from "vue";
import PostItemHead from "@/components/posts/postItemHead.vue";

interface Props {
  p: Post;
  mode: 'internal' | 'external';
}

const props = defineProps<Props>();

const currentMedia = ref<number>(0);
</script>

<template>
  <div class="posts-item__wrapper">

    <post-item-head :post="props.p" :mode="props.mode" />

    <div class="post-item-media__wrapper mt-2" v-if="p.media && p.media.length">
      <v-carousel :show-arrows="p.media.length > 1" hide-delimiters class="media__slider" @update:model-value="i => typeof i === 'number' ? currentMedia = i : currentMedia = 0">
        <v-carousel-item
            v-for="(m, index) in p.media"
            :key="m.id"
            :value="index"
        >

          <div v-if="m.type.startsWith('image/')" class="post-item-media__img">
            <v-img :src="m.url" :alt="'Image ' + index">
              <template v-slot:placeholder>
                <skeleton-loader />
              </template>
            </v-img>
          </div>

          <div v-if="m.type.startsWith('video/')" class="post-item-media__video">
            <video-player :inactivityTimeout="0" :playsinline="true" :responsive="true" :fill="true" preload="metadata" :src="m.url" controls/>
          </div>
        </v-carousel-item>
      </v-carousel>
      <span v-if="p.media.length > 1" class="mt-1 media__counter">{{ `${currentMedia + 1} из ${p.media.length}` }}</span>
    </div>

    <div class="post-item__text mt-2">
      <h6>{{ p.text }}</h6>
    </div>

    <div class="post-item__reactions">
      <post-reactions :post="p"/>
    </div>
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
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .post-item-media__video, .post-item-media__img{
      height: 100%  !important;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .media__slider{
      height: 250px !important;
    }

  }
}

.media__counter {
  opacity: 0.8;
  font-size: 12px;
  font-weight: 500;
  color: grey;
}
</style>
