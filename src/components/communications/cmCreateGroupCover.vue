<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, ref} from "vue";
import Cropper from "cropperjs";

const emit = defineEmits<{
  (e: 'coverSelect', img: string | ArrayBuffer): void
}>()

const imageUrl = ref<string | ArrayBuffer | null>(null);
const imageUrlOriginal = ref<string | ArrayBuffer | null>(null);

const showModal = ref(false);
const cropper = ref<Cropper | null>(null);
const imageElement = ref<HTMLImageElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imageUrl.value = reader.result;
      imageUrlOriginal.value = reader.result;
      showModal.value = true;
    };
    reader.readAsDataURL(file);
  }
};

const initializeCropper = () => {
  nextTick(() => {
    if (imageElement.value && imageUrl.value) {
      cropper.value?.destroy();
      cropper.value = new Cropper(imageElement.value, {
        background: false,
        dragMode: "move",
        viewMode: 1,
        aspectRatio: 1,
        cropBoxMovable: true,
        cropBoxResizable: true,
        cropBoxZoom: false,
        toggleDragModeOnDblclick: false,
        minCropBoxHeight: 200,
        minCropBoxWidth: 200,
        ready() {
          cropperAvatarResize()
        }
      });
    }
  });
};

const cropperAvatarResize = () => {
  const viewBox = document.querySelector(".cropper-view-box");
  const face = document.querySelector(".cropper-face");

  if (viewBox && face) {
    viewBox.classList.add("cropper-view-box-avatar");
    face.classList.add("cropper-face-avatar");
  }
};

const handleCrop = () => {
  if (cropper.value) {
    imageUrl.value = cropper.value.getCroppedCanvas().toDataURL();
    showModal.value = false;
    emit('coverSelect', imageUrl.value)
  }
};

const handleCancel = () => {
  imageUrl.value = null;
  showModal.value = false;
  cropper.value = null;
};

onMounted(() => {
  if (showModal.value) {
    initializeCropper();
  }
});
onUnmounted(() => {
  if (cropper.value) {
    cropper.value.destroy();
  }
});
</script>

<template>
  <div class="cm-create-group-avatar__wrapper">
    <div v-if="!showModal" @click="fileInput ? fileInput.click() : false" class="avatar-wrapper align-self-center">
      <div class="avatar-container">
        <img v-if="imageUrl" class="avatar-preview" :src="typeof imageUrl === 'string' ? imageUrl : ''" alt="Аватарка"/>

        <v-avatar v-else size="200" class="avatar-preview">
          <v-icon color="green" size="large">mdi-camera</v-icon>
        </v-avatar>

        <div class="avatar-preview-overlay">
          <v-icon color="green" size="large">mdi-camera</v-icon>
        </div>
      </div>
      <input ref="fileInput" type="file" @change="handleImageUpload" accept="image/*" style="display: none;"/>
    </div>

    <div class="cropper-container__wrapper"v-if="showModal && imageUrl">
      <div class="cropper-container">
        <img ref="imageElement" :src="typeof imageUrl === 'string' ? imageUrl : ''" alt="Preview" @load="initializeCropper"/>
      </div>

      <div class="cropper-container__controls">
        <button class="cropper-container__control __close" @click="handleCancel">
          <v-icon color="red">mdi-close</v-icon>
        </button>
        <button class="cropper-container__control __check" @click="handleCrop">
          <v-icon color="green">mdi-check</v-icon>
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">

.cm-create-group-avatar__wrapper{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.cropper-container__controls{
  display: flex;
  width: 100%;
  gap: 5px;
  margin-top: 5px;

  .cropper-container__control{
    width: 100%;
    padding: 5px;
    transition: .3s;
    border-radius: 5px;
    border: 1px solid currentColor;
    &.__check{
      color: #4caf50;
    }
    &.__close{
      color: #f44336;
    }
    &:hover{
      filter: drop-shadow(0 0 2px currentColor);
    }
  }
}
.cropper-container__wrapper{
  width: 100%;
}

.avatar-wrapper {
  width: 200px;
  height: 200px;
}

.avatar-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
}

.avatar-preview, .avatar-preview-overlay {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px solid green;
  cursor: pointer;
}

.avatar-preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0);
  transition: 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  *{
    opacity: 0;
    transition: 0.3s;
  }
}

.avatar-container:hover .avatar-preview-overlay {
  background-color: rgba(0, 0, 0, 0.2);
  *{
    opacity: 1;
  }
}

/* стили для  КРОППЕРА */

.cropper-container {
  width: 100%;
  overflow: hidden;
  border-radius: 15px;
  border: 1px solid black;
}

.cropper-container img {
  height: 300px;
  width: 100%;
}
</style>