<script setup lang="ts">
import { ref } from "vue";
import ScrollableContainer from "@/components/common/scrollableContainer.vue";
import {useNotificationStore} from "@/stores/notifications";
import MultimediaControlList from "@/components/multimedia/multimediaControlList.vue";
import {useMultimediaStore} from "@/stores/multimedia";
import MultimediaItem from "@/components/multimedia/multimediaItem.vue";

const notificationStore = useNotificationStore();
const multimediaStore = useMultimediaStore();

const files = ref<{ id: string, file: File, previewUrl?: string, type: string }[]>([]);

const handleFileUpload = (event: DragEvent | Event) => {
  event.preventDefault();

  let filesList: FileList | null = null;

  if (event instanceof DragEvent) {
    filesList = event.dataTransfer?.files;
  } else if (event instanceof Event) {
    filesList = (event.target as HTMLInputElement).files;
  }

  if (filesList && filesList.length > 0) {
    const availableSlots = 16 - files.value.length < 0 || 16 - (files.value.length + filesList.length) < 0;
    if (availableSlots) {
      notificationStore.addNotification('warning', 'Вы можете загрузить не более 16 файлов!', 3000)
      return;
    }

    Array.from(filesList).forEach(file => {
      const isDuplicate = files.value.some(existingFile => existingFile.file.name === file.name);

      if (!isDuplicate) {
        const fileType = file.type.split('/')[0];
        const uniqueId = `${file.name}-${Date.now()}-${Math.random()}`;

        const fileEntry = {
          id: uniqueId,
          file,
          type: fileType,
        };

        if (fileType === 'image' || fileType === 'audio' || fileType === 'video') {
          const reader = new FileReader();
          reader.onload = () => {
            fileEntry.previewUrl = reader.result as string;
            files.value.push(fileEntry);
          };
          reader.readAsDataURL(file);
        } else {
          files.value.push(fileEntry);
        }
      }
    });
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

  // аплоад на s3
  await multimediaStore.upload(formData);
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
};
</script>

<template>
  <div class="modal-block" @dragover.prevent @drop="handleFileUpload">

    <div class="file-drop-area" @click="openFileDialog">
      <input ref="fileInput" type="file" @change="handleFileUpload" multiple class="file-input"/>
      <span class="file-drop-text">Перетащите файлы сюда или нажмите, чтобы выбрать</span>
    </div>

    <scrollable-container v-if="files.length" :use-scroll-bar="true" mode="filter">
      <div class="files-preview__wrapper">
        <multimedia-item @handle-delete="(id) => deleteFile(id)" :files="files"/>
      </div>
    </scrollable-container>

    <div class="controls" v-if="files.length">
      <hr />
      <div v-if="!isMenuVisible" class="d-flex align-items-center justify-content-between position-relative">
        <span>{{ `Добавлено ${files.length} из 16` }}</span>
        <v-icon color="green">mdi-chevron-down</v-icon>
        <button @click="isMenuVisible = true" class="btn__control-lower position-absolute top-0 right-0 left-0 bottom-0"></button>
      </div>

      <div v-else class="d-flex align-items-center justify-content-between position-relative flex-wrap collapsed-control__menu">
        <span>{{ `Выбрано ${selectedList.length} из ${files.length}` }}</span>
        <div class="d-flex align-items-center flex-wrap collapsed-control__menu-sub">
          <v-btn icon size="medium" v-if="selectedList.length" color="red" variant="text" class="text-none btn__control-upper" @click="filterAll">
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

    <div class="actions">
      <v-btn @click="uploadFiles" class="text-none w-100">
        Загрузить файлы
      </v-btn>
    </div>

    <div v-if="multimediaStore.pending">
      {{multimediaStore.progress}}
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-block {
  box-shadow: 0 1px 10px currentColor;
  background: rgb(var(--v-theme-background));
  border-radius: 15px;
  padding: 15px;
  width: 100%;
  display: grid;
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
  margin: 20px 5px 0 5px;
}

.actions {
  margin-top: 20px;
}
</style>
