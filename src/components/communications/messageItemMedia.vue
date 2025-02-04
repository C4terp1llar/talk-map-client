<script setup lang="ts">
import type { ShortMediaDialogMessage } from "@/helpers/interfaces";
import { computed } from "vue";
import { getFileIcon } from "@/helpers/fileDisplayCover";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";

interface Props {
  m: ShortMediaDialogMessage[];
}

const props = defineProps<Props>();

const files = computed(() => ({
  images: props.m.filter(file => file.type.startsWith("image/")),
  videos: props.m.filter(file => file.type.startsWith("video/")),
  audios: props.m.filter(file => file.type.startsWith("audio/")),
  others: props.m.filter(file => !file.type.startsWith("image/") && !file.type.startsWith("video/") && !file.type.startsWith("audio/"))
}));
</script>

<template>
  <div class="message-item__media-wrap" v-if="m.length">

    <div class="media__photo" v-if="files.images.length">
      <div class="media__photo-item" v-for="i in files.images" :key="i._id">

        <img :src="i.url" alt="Фото" class="image-preview">
      </div>
    </div>

    <div class="media__video" v-if="files.videos.length">
      <div class="media__video-item" v-for="i in files.videos" :key="i._id">
        <video controls class="video-preview">
          <source :src="i.url" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>
    </div>

    <div class="media__audio" v-if="files.audios.length">
      <div class="media__audio-item" v-for="i in files.audios" :key="i._id">
        <audio controls class="audio-preview">
          <source :src="i.url" type="audio/mpeg" />
          Ваш браузер не поддерживает аудио.
        </audio>
      </div>
    </div>

    <div class="media__other" v-if="files.others.length">
      <div class="media__other-item" v-for="i in files.others" :key="i._id">
        <div class="media__other-item__download">
          <v-icon>mdi-download</v-icon>
          <a :href="i.url" target="_blank"></a>
        </div>
        <span class="file__name __no-wrap-txt">{{i.name}}</span>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.message-item__media-wrap {
  width: 100%;
  max-width: 100%;
}

.media__photo,
.media__video,
.media__audio,
.media__other {
  display: flex;
  flex-wrap: wrap;

  width: 100%;
}

img{
  max-width: 100%;
}

.media__photo-item,
.media__video-item,
.media__audio-item,
.media__other-item {
  border-radius: 10px;
  margin: 2px 0;
  width: 100%;
  max-width: 100%;
}

.media__other-item{
  border: 1px solid lightgrey;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  padding: 5px;
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
}

.media__video{
  video{
    min-width: 100px;
    max-width: inherit;
  }
}

.image-preview,
.video-preview,
.audio-preview {
  border-radius: 8px;
}

.media__audio-item{
  display: flex;
  audio{
    width: 100%;
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
