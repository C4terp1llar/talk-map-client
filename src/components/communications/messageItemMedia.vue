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
        <v-img :src="i.url" alt="Фото" class="image-preview" cover>
          <template v-slot:placeholder>
            <skeleton-loader />
          </template>
        </v-img>
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
        <v-icon :size="40">{{ getFileIcon(i.name) }}</v-icon>
        <span class="file__name">{{ i.name }}</span>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.message-item__media-wrap {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.media__photo,
.media__video,
.media__audio,
.media__other {
  display: flex;
  flex-wrap: wrap;

  max-width: 700px;
  width: 300px;
  min-width: 100px;
}

.media__photo-item,
.media__video-item,
.media__audio-item,
.media__other-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin: 2px;

  width: 100%;
}

.media__video{
  video{
    min-width: 100px;
    max-width: 300px;
  }
}

.image-preview,
.video-preview,
.audio-preview {
  border-radius: 8px;
}

.file__name {
  font-size: 12px;
  text-align: center;
  max-width: 100px;
  word-wrap: break-word;
}
</style>
