<script setup lang="ts">

import {getFileIcon} from "../../helpers/fileDisplayCover";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";

interface Props {
  files: { id: string, file: File, previewUrl?: string, type: string }[],
  sender: 'photo' | 'post' | 'message'
}

const props = defineProps<Props>();
const emit = defineEmits(['handle-delete'])
</script>

<template>
  <div v-for="fileEntry in props.files" :key="fileEntry.id" :class="['file-preview', `${props.sender}`]">

    <div class="file-preview__img" v-if="fileEntry.type === 'image'" >
      <v-img :src="fileEntry.previewUrl" alt="Превью изображения" class="image-preview" cover>
        <template v-slot:placeholder>
          <skeleton-loader/>
        </template>
      </v-img>
      <span class="file__name">{{ fileEntry.file.name }}</span>
    </div>

    <div class="file-preview__audio" v-if="fileEntry.type === 'audio'">
      <audio  controls class="audio-preview">
        <source :src="fileEntry.previewUrl" type="audio/mpeg"/>
        Ваш браузер не поддерживает аудио.
      </audio>
      <v-icon :size="65" class="icon-audio">mdi-music</v-icon>
      <span class="file__name">{{ fileEntry.file.name }}</span>
    </div>

    <div class="file-preview__video" v-if="fileEntry.type === 'video'" >
      <video controls class="video-preview">
        <source :src="fileEntry.previewUrl" type="video/mp4"/>
        Ваш браузер не поддерживает видео.
      </video>
      <span class="file__name">{{ fileEntry.file.name }}</span>
    </div>

    <div class="file-preview__other" v-if="!fileEntry.previewUrl">
      <v-icon :size="65" class="ma-auto">{{ getFileIcon(fileEntry.file.name) }}</v-icon>
      <span class="file__name">{{ fileEntry.file.name }}</span>
    </div>

    <button class="delete-img" @click="emit('handle-delete', fileEntry.id)">
      <v-icon class="" color="red" size="15">mdi-close</v-icon>
    </button>
  </div>
</template>

<style scoped lang="scss">

.file-preview {
  position: relative;
  &.message{
    .file-preview__audio, .file-preview__video, .file-preview__img,  .file-preview__other{
      height: 100px;
      width: 150px;
    }
    .image-preview, .audio-preview, .video-preview{
      height: 70%;
    }
  }
}

.file-preview__audio, .file-preview__video, .file-preview__img,  .file-preview__other{
  height: 150px;
  width: 200px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.file-preview__audio{
  width: 250px;
  position: relative;

  .icon-audio{
    position: absolute;
    color: #4CAF50;
    filter: drop-shadow(0 0 5px currentColor);
  }
}

.image-preview, .audio-preview, .video-preview {
  width: inherit;
  height: 80%;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid currentColor;
}

.audio-preview{
  background-image: url("/sounds/sound_wrapper.jpg");
  background-position: center;
  background-size: cover;
}

.file__name {
  font-size: 12px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  margin-top: 5px;
}

.delete-img {
  position: absolute;
  right: 3px;
  top: 3px;
  padding: 5px 5px;
  border-radius: 50%;
  background-color: currentColor;

  transition: 0.3s;
  display: flex;
  align-items: center;

  &:hover {
    filter: drop-shadow(0 0 2px red);
  }
}
</style>