<script setup lang="ts">
import {computed, nextTick, onBeforeMount, onMounted, onUnmounted, ref} from "vue";
import {onClickOutside} from "@vueuse/core";
import {useImagePopupStore} from "@/stores/imagePopup";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import {useUserStore} from "@/stores/user";
import {useNotificationStore} from "@/stores/notifications";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";

const imagePopupStore = useImagePopupStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore()

const cropperOptions = computed(() => {
  if (imagePopupStore.senderType === "avatar") {
    return {
      background: false,
      dragMode: "move",
      viewMode: 3,
      aspectRatio: 1,
      cropBoxMovable: true,
      cropBoxResizable: true,
      cropBoxZoom: false,
      toggleDragModeOnDblclick: false,
      minCropBoxHeight: 200,
      minCropBoxWidth: 200,
    };
  } else if (imagePopupStore.senderType === "wallpaper") {
    return {
      background: false,
      dragMode: "move",
      viewMode: 3,
      cropBoxMovable: false,
      cropBoxResizable: false,
      cropBoxZoom: false,
      toggleDragModeOnDblclick: false,
    };
  }
});

const imageSrc = ref<string | ArrayBuffer>(imagePopupStore.cropImageData[0]);

const refModalCropperPopup = ref<HTMLElement | null>(null);
onClickOutside(refModalCropperPopup, () => imagePopupStore.closePopup());

const cropperInstance = ref<Cropper | null>(null);
const imageElement = ref<HTMLImageElement | null>(null);

const adjustCropBox = () => {
  if (cropperInstance.value) {
    const cropperWidth = refModalCropperPopup.value?.clientWidth;
    if (cropperWidth) {
      cropperInstance.value.setCropBoxData({
        width: cropperWidth,
      });
    }
  }
};

const initializeCropper = () => {
  nextTick(() => {
    if (imageElement.value && imageSrc.value) {
      cropperInstance.value?.destroy();
      cropperInstance.value = new Cropper(imageElement.value, {
        ...cropperOptions.value,
        ready() {
          adjustCropBox();
          cropperAvatarResize();
        }
      });
    }
  });
};

const cropperAvatarResize = () => {
  const viewBox = document.querySelector(".cropper-view-box");
  const face = document.querySelector(".cropper-face");

  if (viewBox && face && imagePopupStore.senderType === "avatar") {
    viewBox.classList.add("cropper-view-box-avatar");
    face.classList.add("cropper-face-avatar");
  }
};

onUnmounted(() => {
  setTimeout(() => {
    cropperInstance.value?.destroy();
  },200)

  window.removeEventListener("resize", handleResize);
});

onBeforeMount(() => {
  if (imageSrc.value) {
    initializeCropper();
  }
  window.addEventListener("resize", handleResize);
});

const handleResize = () => {
  cropperInstance.value?.reset();
  adjustCropBox();
};

const handleCrop = async () => {
  if (cropperInstance.value) {
    const croppedImg = cropperInstance.value.getCroppedCanvas().toDataURL();

    const sender = imagePopupStore.senderType
    const force = imagePopupStore.exactForce
    const originalImage = imageSrc.value;

    imagePopupStore.closePopup();

    if (sender === "avatar") {
      await avatarActions(croppedImg, originalImage, force);
    } else if (sender === "wallpaper") {
      await wallpaperActions(croppedImg, originalImage, force);
    }

  }
};

const avatarActions = async (newImg: string | ArrayBuffer, oldImg: string | ArrayBuffer, force: string) => {

  if (force === 'uploadCrop'){
    await userStore.setUserAvatar(newImg, oldImg, 'uploadCrop')
  }else{
    await userStore.setUserAvatar(newImg,'', 'onlyCrop')
  }

  if (userStore.avatarError) {
    notificationStore.addNotification('error', userStore.avatarError, 3000)
  }

}

const wallpaperActions = async (newImg: string | ArrayBuffer, oldImg: string | ArrayBuffer, force: string) => {

  if (force === 'uploadCrop'){
    await userStore.setUserWallpaper(newImg, oldImg, 'uploadCrop')
  }else{
    await userStore.setUserWallpaper(newImg, '','onlyCrop')
  }

  if (userStore.wallpaperError) {
    notificationStore.addNotification('error', userStore.wallpaperError, 3000)
  }

}

// await setWallpaper(data)

// const setWallpaper = async (data: (string | ArrayBuffer)[]) => {
//   await userStore.setUserWallpaper(data)
//
//   if (userStore.wallpaperError){
//     notificationStore.addNotification('error', userStore.wallpaperError, 3000)
//   }
// }

</script>

<template>
  <div class="modal-cropper-block" ref="refModalCropperPopup">
    <div class="cropper-container">
      <img ref="imageElement" :src="typeof imageSrc === 'string' ? imageSrc : ''" alt="Preview"/>
    </div>
    <div class="actions">
      <v-btn class="text-none w-100" variant="outlined" @click="handleCrop">Готово</v-btn>
      <v-btn @click="imagePopupStore.closePopup" class="text-none w-100 mt-1" variant="plain" color="green">Отмена
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">

.modal-cropper-block {

  position: relative;
  margin: 5px;

  max-width: 700px;
  min-width: 250px;
  max-height: 50vh;

  box-shadow: 0 1px 10px currentColor;
  background: rgb(var(--v-theme-background));
  border-radius: 15px;
  padding: 15px 15px 0 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .actions {
    position: sticky;
    bottom: 0;
    background: rgb(var(--v-theme-background));
    padding: 15px;
  }
}

.cropper-container {
  overflow: hidden;
  border-radius: 15px;
  border: 1px solid black;
}

</style>
