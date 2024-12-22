<script setup lang="ts">
import type { Post } from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {onMounted, ref} from 'vue';

interface Props {
  posts: Post[];
  mode: 'internal' | 'external';
}

const props = defineProps<Props>();

const activeMedia = ref(0);
</script>

<template>
  <div class="posts-item__wrapper" v-for="p in props.posts" :key="p._id">

    <div class="post-item__head">
      <h6 class="text-center">Мб какой-то заголовок</h6>
    </div>

    <div class="post-item-media__wrapper" v-if="p.media && p.media.length">
      <v-carousel v-model:active="activeMedia" hide-delimiters :height="300">
        <v-carousel-item
            v-for="(m, index) in p.media"
            :key="m.id"
        >

          <div v-if="m.type.startsWith('image/')" class="post-item-media__img">
            <v-img :src="m.url" :alt="'Image ' + index" >
              <template v-slot:placeholder>
                <skeleton-loader />
              </template>
            </v-img>
          </div>

          <div v-if="m.type.startsWith('video/')" class="post-item-media__video">
            <video class="exact__video" controls :src="m.url" :alt="'Video ' + index" />
          </div>
        </v-carousel-item>
      </v-carousel>
    </div>

    <div class="post-item__text">
      {{ p.text }}
    </div>

    <div class="post-item__reactions">
      <!-- Реакции можно добавлять здесь -->
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

    .post-item-media__img, .post-item-media__video{
      width: 100%;
      height: 300px !important;
      display: flex;
      justify-content: center;
      align-items: center;
      img, video{
        width: auto;
        height: inherit;
      }
    }
  }
}

</style>
