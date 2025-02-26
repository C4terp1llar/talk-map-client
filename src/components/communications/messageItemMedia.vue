<script setup lang="ts">
import type { ShortMediaDialogMessage } from "@/helpers/interfaces";
import { computed } from "vue";
import { getFileIcon } from "@/helpers/fileDisplayCover";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {getFileSize} from "@/helpers/getFileSize";

interface Props {
  m: ShortMediaDialogMessage[];
}

const props = defineProps<Props>();

const files = computed(() => ({
  images: props.m.filter(file => file.type.startsWith("image/")),
  videos: props.m.filter(file => file.type.startsWith("video/")),
  others: props.m.filter(file => !file.type.startsWith("image/") && !file.type.startsWith("video/"))
}));
</script>

<template>
  <div class="message-item__media-wrap" v-if="m.length">

    <div class="media__gallery" v-if="files.images.length">
      <div class="image-item__wrapper" v-for="i in files.images" :key="i._id">
        <img :src="i.url" alt="Фото" class="image-preview">
      </div>
    </div>

    <div class="media__gallery __video" v-if="files.videos.length">
      <div class="video-item__wrapper" v-for="i in files.videos" :key="i._id">
        <video controls class="video-preview">
          <source :src="i.url" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>
    </div>

    <div class="media__other" v-if="files.others.length">
      <div class="media__other-item" v-for="i in files.others" :key="i._id">
        <div class="media__other-item__download">
          <v-icon>mdi-download</v-icon>
          <a :href="i.url" target="_blank"></a>
        </div>
        <span class="file__name __no-wrap-txt">{{i.name}}</span>
        <div class="file__size"><span>{{getFileSize(i.size)}}</span></div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">

.media__gallery {
  display: grid;
  grid-auto-flow: dense;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  &.__video{
    grid-template-columns: repeat(2, 1fr) !important;
    & > :first-child {
      grid-column: span 2 !important;
    }
  }

  & > :first-child {
    grid-column: span 3;
  }

  /*
  &:has(:nth-child(1):nth-last-child(1)) {
    grid-template-columns: 1fr;
  }

  &:has(:nth-child(1):nth-last-child(2)) {
    grid-template-columns: 1fr;
  }

  &:has(:nth-child(3)) {
    grid-template-columns: repeat(3, 1fr);

    & > :nth-child(1) {
      grid-column: span 3;
    }
  }
  */

  .image-item__wrapper,
  .video-item__wrapper {
    display: flex;
  }

  img, video {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 0 2px grey;
  }
}



.media__other-item{
  border: 1px solid lightgrey;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
  .media__other-item__download{
    position: relative;
    padding: 5px;
    margin-right: 10px;
    border-radius: 50%;
    border: 1px solid lightgrey;
    transition: .3s;

    &:hover{
      background-color: #7777;
    }
    a{
      position: absolute;
      inset: 0;
    }
  }
  .file__size{
    margin-left: 5px;
    font-size: 12px;
    font-weight: 500;
  }
}

.file__name {
  font-size: 12px;
  text-align: left;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

</style>
