<script setup lang="ts">
import {useNotificationStore} from "@/stores/notifications";
import {useImagePopupStore} from "@/stores/imagePopup";
import {ref} from "vue";
import {onClickOutside} from "@vueuse/core";

const notificationStore = useNotificationStore()
const imagePopupStore = useImagePopupStore();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const imageUrls = ref<(string | ArrayBuffer)[]>([]);

const MIN_AVATAR_DIMENSIONS = { width: 200, height: 200 };
const MIN_WALLPAPER_DIMENSIONS = { width: 600, height: 300 };

const handleFileUpload = (event: DragEvent | Event) => {
  event.preventDefault();
  isDragging.value = false;

  let files: FileList | null = null;

  if (event instanceof DragEvent) {
    files = event.dataTransfer?.files;
  } else if (event instanceof Event) {
    files = (event.target as HTMLInputElement).files;
  }

  if (imagePopupStore.modeType === 'single' && (files && (files.length > 1 || imageUrls.value.length >= 1))) {
    notificationStore.addNotification('warning', 'Вы можете загрузить только 1 фотографию', 3000);
    return;
  }

  if (imagePopupStore.modeType === 'many' && files && files.length + imageUrls.value.length > 16) {
    notificationStore.addNotification('warning', 'Вы можете загрузить не более 16 фотографий за 1 раз', 3000);
    return;
  }

  if (files && files.length > 0) {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        notificationStore.addNotification('warning', 'Вы можете загрузить только изображения', 3000);
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const fileContent = reader.result;

        const img = new Image();
        img.src = fileContent as string | ArrayBuffer;

        img.onload = () => {
          const { width, height } = img;

          if (imagePopupStore.senderType === 'avatar') {
            if (width < MIN_AVATAR_DIMENSIONS.width || height < MIN_AVATAR_DIMENSIONS.height) {
              notificationStore.addNotification('warning', `Минимальное разрешение для аватара: ${MIN_AVATAR_DIMENSIONS.width}x${MIN_AVATAR_DIMENSIONS.height} пикселей`, 3000);
              return;
            }
          } else if (imagePopupStore.senderType === 'wallpaper') {
            if (width < MIN_WALLPAPER_DIMENSIONS.width || height < MIN_WALLPAPER_DIMENSIONS.height) {
              notificationStore.addNotification('warning', `Минимальное разрешение для обоев: ${MIN_WALLPAPER_DIMENSIONS.width}x${MIN_WALLPAPER_DIMENSIONS.height} пикселей`, 3000);
              return;
            }
          }

          if (!imageUrls.value.includes(fileContent as string | ArrayBuffer)) {
            imageUrls.value.push(fileContent as string | ArrayBuffer);
          }
        };

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

const refModalPopup = ref(null)
onClickOutside(refModalPopup, e => imagePopupStore.closePopup())

const handleSubmitUpload = async () => {
  if (imageUrls.value.length <= 0 || imageUrls.value.length >= 17) return;

  const sender = imagePopupStore.senderType

  if (sender === 'wallpaper' || sender === 'avatar'){
    imagePopupStore.cropImageData = imageUrls.value;
    imagePopupStore.actionType = 'crop';
  }
}

</script>

<template>
  <div class="modal-block" @dragover.prevent @drop="handleFileUpload" ref="refModalPopup">
    <div class="file-drop-area" @click="openFileDialog">
      <input ref="fileInput" type="file" @change="handleFileUpload" multiple accept="image/*" class="file-input"/>
      <span class="file-drop-text">Перетащите картинки сюда или нажмите, чтобы выбрать</span>
    </div>


    <div class="images">
      <div class="img-preview" v-for="(imageUrl, index) in imageUrls" :key="index">
        <img :src="imageUrl" alt="Превью" class="image-preview"/>

        <button class="delete-img" @click="deleteImg(index)">
          <v-icon size="15">mdi-close</v-icon>
        </button>
      </div>
    </div>


    <div class="actions">
      <v-btn
          class="text-none w-100"
          variant="outlined"
          @click="handleSubmitUpload"
      >
        Готово
      </v-btn>
      <v-btn
          class="close-upload-modal__btn text-none w-100 mt-1"
          variant="plain"
          color="green"
          @click="imagePopupStore.closePopup"
      >
        Отмена
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-block {
  overflow-y: auto;
  position: relative;

  margin: 5px;

  width: 700px;
  max-height: 60vh;

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
    margin: 15px 0 0 0;
    flex-wrap: wrap;
    justify-content: center;
  }

  .img-preview {
    position: relative;

    .delete-img {
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

      &:hover {
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
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .actions {
    position: sticky;
    bottom: 0;
    background: rgb(var(--v-theme-background));
    padding: 15px;
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
  background: #777777;
  border-radius: 15px;
}
</style>