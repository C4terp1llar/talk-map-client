<script setup lang="ts">

const fileIcons: Record<string, string> = {
  zip: 'mdi-archive-outline',
  rar: 'mdi-archive-outline',
  doc: 'mdi-file-word-outline',
  docx: 'mdi-file-word-outline',
  pdf: 'mdi-file-pdf-box',
  jpg: 'mdi-file-image',
  jpeg: 'mdi-file-image',
  png: 'mdi-file-image',
  gif: 'mdi-file-image',
  mp4: 'mdi-multimedia',
  avi: 'mdi-multimedia',
  mov: 'mdi-multimedia',
  flac: 'mdi-multimedia',
  mp3: 'mdi-multimedia',
  wav: 'mdi-multimedia',
  xlsx: 'mdi-file-excel-outline',
  pptx: 'mdi-file-powerpoint-outline',
  xls: 'mdi-file-excel-outline',
  ppt: 'mdi-file-powerpoint-outline',
  odt: 'mdi-file-word-outline',
  ods: 'mdi-file-excel-outline',
};

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return fileIcons[extension || ''] || 'mdi-file-outline';
};

interface Props {
  files: { id: string, file: File, previewUrl?: string, type: string }[]
}

const props = defineProps<Props>();
const emit = defineEmits(['handle-delete'])
</script>

<template>
  <div v-for="fileEntry in props.files" :key="fileEntry.id" class="file-preview">

    <div class="file-preview__img" v-if="fileEntry.type === 'image'" >
      <img :src="fileEntry.previewUrl" alt="Превью изображения" class="image-preview" />
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
  right: 5px;
  top: 5px;
  padding: 5px 5px;
  border-radius: 5px;
  background-color: rgba(211, 211, 211, 0.25);

  opacity: .7;
  transition: 0.3s;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 1;
  }
}
</style>