<script setup lang="ts">
import { ref } from 'vue';
import {useNotificationStore} from "@/stores/notifications";
import {vAutoAnimate} from '@formkit/auto-animate'
const notificationStore = useNotificationStore()

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const imageUrls = ref<(string | ArrayBuffer)[]>([]);

const handleFileUpload = (event: DragEvent | Event) => {
  event.preventDefault();
  isDragging.value = false;

  let files: FileList | null = null;

  if (event instanceof DragEvent) {
    files = event.dataTransfer?.files;
  } else if (event instanceof Event) {
    files = (event.target as HTMLInputElement).files;
  }

  if(files && files.length + imageUrls.value.length > 16){
    notificationStore.addNotification('warning', 'Вы можете загрузить не более 16 фотографий за 1 раз', 3000)
    return
  }

  if (files && files.length > 0) {
    Array.from(files).forEach(file => {
      const reader = new FileReader();

      reader.onload = () => {
        const fileContent = reader.result;

        if (!imageUrls.value.includes(fileContent as string | ArrayBuffer)) {
          imageUrls.value.push(fileContent as string | ArrayBuffer);
        }
      };

      reader.readAsDataURL(file);
    });
  }
};



const deleteImg = (index: number) => {
  imageUrls.value.splice(index, 1);
}

const openFileDialog = () => {
  fileInput.value?.click();
};

</script>

<template>
  <div class="modal-img-upload-wrapper">
    <div class="modal-block" @dragover.prevent @drop="handleFileUpload">
      <div class="file-drop-area" @click="openFileDialog">
        <input ref="fileInput" type="file" @change="handleFileUpload" multiple class="file-input" />
        <span class="file-drop-text">Перетащите файлы сюда или нажмите, чтобы выбрать</span>
      </div>


        <div class="images">
          <div class="img-preview" v-for="(imageUrl, index) in imageUrls" :key="index">
            <img :src="imageUrl" alt="Превью" class="image-preview" />

            <button class="delete-img" @click="deleteImg(index)">
              <v-icon size="15">mdi-close</v-icon>
            </button>
          </div>
        </div>


      <div class="actions">
        <v-btn
          class="text-none w-100"
          variant="outlined"
        >
          Загрузить
        </v-btn>
        <v-btn
            class="text-none w-100 mt-1"
            variant="plain"
            color="green"
        >
          Отмена
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-img-upload-wrapper {
  z-index: 10000;
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);

  .modal-block {
    overflow-y: auto;
    position: relative;

    margin: 5px;

    width: 700px;
    max-height: 50vh;

    box-shadow: 0 1px 10px currentColor;
    background: rgb(var(--v-theme-background));
    border-radius: 15px;
    padding: 15px 15px 0 15px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .file-drop-area {
      border: 2px dashed green;
      border-radius: 15px;
      width: 100%;
      height: 30%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 30px;

      position: sticky;
      top: 0;

      background: rgb(var(--v-theme-background));
      z-index: 10;

      &.dragging {
        border-color: #66c5ff;
        background-color: rgba(102, 197, 255, 0.1);
      }

      .file-input {
        display: none;
      }

      .file-drop-text {
        font-size: 14px;
        color: #999;
        text-align: center;
        transition: color 0.3s;
      }
    }

    .images {
      display: flex;
      gap: 10px;
      margin: 15px 0;
      flex-wrap: wrap;

      justify-content: center;
    }

    .img-preview {
      position: relative;

      .delete-img{
        position: absolute;
        right: 5px;
        top: 5px;
        padding: 5px 5px;
        border-radius: 5px;
        background: rgb(var(--v-theme-background));
        opacity: .7;
        transition: 0.3s;
        display: flex;
        align-items: center;

        &:hover{
          opacity: 1;
        }
      }
    }

    .image-preview {
      width: 150px;
      height: 150px;
      border-radius: 15px;
      object-fit: cover;
      border: 1px solid currentColor;
      animation: fade 1s;
    }

    @keyframes fade {
      from{
        opacity: 0;
      }
      to{
        opacity: 1;
      }
    }

    .actions{
      position: sticky;
      bottom: 0;
      background: rgb(var(--v-theme-background));
    }
  }
}

.modal-block::-webkit-scrollbar {
  width: 8px;
  margin-right: 5px;
}

.modal-block::-webkit-scrollbar-thumb {
  background-color: #c4c4c4;
  border-radius: 15px;
}

.modal-block::-webkit-scrollbar-track {
  margin: 10px;
  background-color: rgb(var(--v-theme-background));
  border-radius: 15px;
}
</style>
