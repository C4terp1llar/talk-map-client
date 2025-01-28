<script setup lang="ts">
import { ref } from "vue";
import ScrollableContainer from "@/components/common/scrollableContainer.vue";
import {useNotificationStore} from "@/stores/notifications";
import MultimediaControlList from "@/components/multimedia/multimediaControlList.vue";
import {useMultimediaStore} from "@/stores/multimedia";
import MultimediaItem from "@/components/multimedia/multimediaItem.vue";
import CircularLoader from "@/components/common/circularLoader.vue";
import {usePhotoStore} from "@/stores/photo";

interface Props {
  sender: 'photo' | 'post' | 'message'
}

const props = defineProps<Props>();

const emit = defineEmits(['slPhoto', 'slPostMedia'])

const notificationStore = useNotificationStore();
const multimediaStore = useMultimediaStore();

const photoStore = usePhotoStore();

const files = ref<{ id: string, file: File, previewUrl?: string, type: string }[]>([]);

const slotsMap = new Map([
  ['photo', 16],
  ['post', 10],
  ['message', 10]
])

const sizeMap = new Map([
  ['photo', 20],
  ['post', 150],
  ['message', 100]
])


const SLOTS = slotsMap.get(props.sender) || 10;
const MAX_FILE_SIZE_MB = sizeMap.get(props.sender) || 100;
const MAX_FILES_SIZE_MB = 500;

const handleFileUpload = async (event: DragEvent | Event) => {
  event.preventDefault();

  let filesList: FileList | null = null;

  if (event instanceof DragEvent) {
    filesList = event.dataTransfer?.files;
  } else if (event instanceof Event) {
    filesList = (event.target as HTMLInputElement).files;
  }
  if (filesList && filesList.length > 0) {
    if (props.sender === 'photo') {
      for (const file of Array.from(filesList)) {
        if (!file.type.startsWith('image/')) {
          notificationStore.addNotification('warning', 'Вы можете загрузить только изображения', 3000);
          return;
        }
      }
    }

    if (props.sender === 'post') {
      for (const file of Array.from(filesList)) {
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          notificationStore.addNotification('warning', 'Вы можете загрузить только изображения или видео', 3000);
          return;
        }
      }
    }

    const currentTotalSizeMB = files.value.reduce((sum, file) => sum + file.file.size, 0) / (1024 * 1024);
    const newFilesTotalSizeMB = Array.from(filesList).reduce((sum, file) => sum + file.size, 0) / (1024 * 1024);
    const totalSizeMB = currentTotalSizeMB + newFilesTotalSizeMB;

    if (totalSizeMB > MAX_FILES_SIZE_MB) {
      notificationStore.addNotification('warning', `Общий размер файлов превышает допустимый лимит в ${MAX_FILES_SIZE_MB} Мб`, 3000);
      return;
    }

    for (const file of Array.from(filesList)) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        notificationStore.addNotification('warning', `Максимально допустимый размер файла - ${MAX_FILE_SIZE_MB} Мб`, 3000);
        return;
      }
    }

    const availableSlots = SLOTS - files.value.length < 0 || SLOTS - (files.value.length + filesList.length) < 0;
    if (availableSlots) {
      notificationStore.addNotification('warning', `Вы можете загрузить не более ${SLOTS} файлов!`, 3000);
      return;
    }


    await Promise.all(
        Array.from(filesList).map(async (file) => {
          const isDuplicate = files.value.some(existingFile => existingFile.file.name === file.name);
          if (!isDuplicate) {
            const fileType = file.type.split('/')[0];
            const uniqueId = `${file.name}-${Date.now()}-${Math.random()}`;

            const fileEntry = {
              id: uniqueId,
              file,
              type: fileType,
              previewUrl: ''
            };

            if (fileType === 'image' || fileType === 'audio' || fileType === 'video') {
              const reader = new FileReader();

              await new Promise<void>((resolve) => {
                reader.onload = async () => {
                  if (fileType === 'image' && (props.sender === 'photo' || props.sender === 'post')) {
                    const img = new Image();
                    img.src = reader.result as string;

                    img.onload = async () => { // Добавлен await
                      if (img.width < 300 || img.height < 300) {
                        notificationStore.addNotification('warning', `Минимальное разрешение для фотографии 300x300 пикселей`, 3000);
                        resolve();
                      } else {
                        fileEntry.previewUrl = reader.result as string;
                        files.value.push(fileEntry);
                        resolve();
                      }
                    };
                  } else {
                    fileEntry.previewUrl = reader.result as string;
                    files.value.push(fileEntry);
                    resolve();
                  }
                };
                reader.readAsDataURL(file);
              });
            } else {
              files.value.push(fileEntry);
            }
          }
        })
    );

    if ((props.sender === 'post'  || props.sender === 'message') && files.value.length) {
      emit('slPostMedia', files.value);
    }
  }
};

const openFileDialog = () => {
  fileInput.value?.click();
};
const fileInput = ref<HTMLInputElement | null>(null);


const uploadFiles = async () => {
  if (!files.value.length) return;

  const formData = new FormData();
  files.value.forEach(fileEntry => {
    formData.append(fileEntry.file.name, fileEntry.file);
  });

  if (props.sender === 'photo') {
    emit('slPhoto', [formData, [{key: 'sender', value: props.sender}]])
    files.value = [];
    isMenuVisible.value = false
    selectedList.value = []
    return;
  }

};

const isMenuVisible = ref<boolean>(false);

const selectedList = ref<string[]>([]);

const selectAll = () => {
  selectedList.value = selectedList.value.length === files.value.length ? [] : files.value.map((file) => file.id);
};

const filterAll = () => {
  files.value = files.value.filter(i => selectedList.value.includes(i.id) === false);
  selectedList.value = []
}

const deleteFile = (id: string) => {
  files.value = files.value.filter((file) => file.id !== id);
  selectedList.value = selectedList.value.filter((fileId) => fileId !== id);

  if (props.sender === 'post' || props.sender === 'message'){
    emit('slPostMedia', files.value)
  }
};

const getAcceptType = (sender:string) => {
  switch (sender) {
    case 'photo':
      return 'image/*';
    case 'post':
      return 'image/*, video/*';
    default:
      return '';
  }
};
</script>

<template>
  <div :class="['modal-block', `${props.sender}`]" @dragover.prevent @drop="handleFileUpload">

    <div class="file-drop-area" @click="openFileDialog">
      <input :accept="getAcceptType(props.sender)"  ref="fileInput" type="file" @change="handleFileUpload" :disabled="multimediaStore.pending || photoStore.pending" multiple class="file-input"/>
      <span class="file-drop-text">Перетащите файлы сюда или нажмите, чтобы выбрать</span>
    </div>

    <scrollable-container v-if="files.length" :use-scroll-bar="true" mode="filter">
      <div :class="['files-preview__wrapper', `${props.sender}`]">
        <multimedia-item :sender="props.sender" @handle-delete="(id) => deleteFile(id)" :files="files"/>
      </div>
    </scrollable-container>

    <div class="post__media-counter mt-2" v-if="props.sender === 'post'">
      <span>{{ `Добавлено ${files.length} из 10` }}</span>
    </div>

    <div class="controls" v-if="files.length && props.sender !== 'post' && props.sender !== 'message'">
      <hr>
      <div v-if="!isMenuVisible" class="head-controls d-flex align-items-center justify-content-between position-relative">
        <span>{{ `Добавлено ${files.length}` }}</span>
        <v-icon color="green">mdi-chevron-down</v-icon>
        <button @click="isMenuVisible = true" class="btn__control-lower position-absolute top-0 right-0 left-0 bottom-0"></button>
      </div>

      <div v-else class="d-flex align-items-center justify-content-between position-relative flex-wrap collapsed-control__menu">
        <span>{{ `Выбрано ${selectedList.length} из ${files.length}` }}</span>
        <div class="d-flex align-items-center flex-wrap collapsed-control__menu-sub">
          <v-btn :disabled="multimediaStore.pending" icon size="medium" v-if="selectedList.length" color="red" variant="text" class="text-none btn__control-upper" @click="filterAll">
            <v-icon color="red">mdi-delete-variant</v-icon>
          </v-btn>
          <v-checkbox-btn class="btn__control-upper" @click="selectAll" :model-value="selectedList.length === files.length" />
          <v-icon color="green">mdi-chevron-up</v-icon>
        </div>
        <button @click.stop="isMenuVisible = false" class="btn__control-lower position-absolute top-0 right-0 left-0 bottom-0"></button>
      </div>

      <multimedia-control-list
          :list="files"
          v-model="selectedList"
          @delete-file="deleteFile"
          v-if="isMenuVisible"
      />
    </div>

    <div class="actions" v-if="props.sender !== 'post' && props.sender !== 'message'">
      <v-btn variant="outlined" @click="uploadFiles" :disabled="multimediaStore.pending || photoStore.pending" class="text-none w-100">
        <template v-if="!multimediaStore.pending && !photoStore.pending">
          Готово
        </template>
        <template v-else>
          <circular-loader :size="20"/>
        </template>
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.head-controls{
  height: 40px;
}

.post__media-counter{
  display: flex;
  justify-content: center;
  span{
    font-size: 12px;
    color: #999;
  }
}

.file-drop-text{
  font-size: 14px;
  color: #999;
  text-align: center;
  transition: color 0.3s;
}

.modal-block {
  box-shadow: 0 1px 10px currentColor;
  background: rgb(var(--v-theme-background));
  border-radius: 15px;
  padding: 15px;
  width: 100%;
  display: grid;

  &.post{
    padding: unset;
    box-shadow: unset;
  }
  &.message{
    padding: unset;
    box-shadow: unset;
  }
}

.file-drop-area {
  border: 2px dashed green;
  border-radius: 15px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
}

.file-input {
  display: none;
}

.files-preview__wrapper{
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  margin: 5px 5px 0 5px;
  &:not(.message){
    margin: 20px 5px 0 5px;
  }
}

.actions {
  margin-top: 20px;
}
</style>
