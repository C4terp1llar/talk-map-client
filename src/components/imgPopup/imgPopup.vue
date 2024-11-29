<script setup lang="ts">
import {useImagePopupStore} from "@/stores/imagePopup";
import ImgPopupUpload from "@/components/imgPopup/imgPopupUpload.vue";
import ImgPopupCropper from "@/components/imgPopup/imgPopupCropper.vue";

const imagePopupStore = useImagePopupStore();
</script>

<template>
  <div class="modal-img-upload-wrapper" v-if="imagePopupStore.isPopupVisible">


      <img-popup-upload class="modal-img-upload-wrapper__upload" v-if="imagePopupStore.actionType === 'upload'"/>

      <img-popup-cropper v-if="imagePopupStore.actionType === 'crop' && imagePopupStore.cropImageData.length"/>


  </div>
</template>

<style scoped lang="scss">
.modal-img-upload-wrapper {
  position: fixed;
  inset: 0;
  z-index: 10003;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}
</style>
