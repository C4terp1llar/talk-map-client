<script setup lang="ts">
import {ref} from "vue";
import MediaUpload from "@/components/multimedia/mediaUpload.vue";
import {useMultimediaStore} from "@/stores/multimedia";
import {usePhotoStore} from "@/stores/photo";
import {useNotificationStore} from "@/stores/notifications";

const multimediaStore = useMultimediaStore()
const photosStore = usePhotoStore()
const notificationStore = useNotificationStore()

const handleUpload = async (payload: any) => {
  await photosStore.uploadPhoto(payload[0], payload[1])

  if (photosStore.error){
    notificationStore.addNotification('error', photosStore.error, 3000)
  }else{
    notificationStore.addNotification('success', 'Фотографии успешно загружены!', 3000)
    multimediaStore.isMenuOpen = false
    await photosStore.getPhotos('load', undefined, undefined, true);
  }
}
</script>

<template>
  <div class="photos-head__wrapper">
    <v-btn @click="multimediaStore.isMenuOpen = !multimediaStore.isMenuOpen" class="text-none" variant="outlined">
      <v-icon>mdi-tray-arrow-up</v-icon>
    </v-btn>

    <v-btn variant="outlined">
      <v-icon>mdi-sort</v-icon>
    </v-btn>
  </div>
  <media-upload @sl-photo="(payload) => handleUpload(payload)" sender="photo" v-show="multimediaStore.isMenuOpen"/>
</template>

<style scoped lang="scss">
.photos-head__wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>