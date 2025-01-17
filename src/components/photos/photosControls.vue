<script setup lang="ts">
import {ref} from "vue";
import MediaUpload from "@/components/multimedia/mediaUpload.vue";
import {useMultimediaStore} from "@/stores/multimedia";
import {usePhotoStore} from "@/stores/photo";
import {useNotificationStore} from "@/stores/notifications";
import PhotoSortOptions from "@/components/photos/photoSortOptions.vue";

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

const isSortVisible = ref(false);
const sortModel = ref<'publish_desc' | 'publish_asc'>('publish_desc');

const handleCloseSort = () => {
  setTimeout(() => isSortVisible.value = false)
}

const changeSort = async (v: 'publish_desc' | 'publish_asc') => {
  sortModel.value = v;
  await reloadPhotos()
}

const localPending = ref(false);
const reloadPhotos = async () => {
  localPending.value = true
  await photosStore.getPhotos('load', undefined, undefined, undefined, sortModel.value)
  localPending.value = false

  if (photosStore.photoError) {
    notificationStore.addNotification('error', photosStore.photoError, 3000)
  }
}
</script>

<template>
  <div class="photos-head__wrapper">
    <v-btn @click="multimediaStore.isMenuOpen = !multimediaStore.isMenuOpen" class="text-none" variant="outlined">
      <v-icon>mdi-tray-arrow-up</v-icon>
    </v-btn>

    <v-btn @click="isSortVisible = true" :loading="localPending" variant="outlined">
      <v-icon :color="sortModel === 'publish_asc' ? 'warning' : ''">mdi-sort</v-icon>
    </v-btn>

    <v-scroll-y-transition>
      <photo-sort-options v-if="isSortVisible" @change="changeSort" :model="sortModel" @close="handleCloseSort" />
    </v-scroll-y-transition>
  </div>
  <media-upload @sl-photo="(payload) => handleUpload(payload)" sender="photo" v-show="multimediaStore.isMenuOpen"/>
</template>

<style scoped lang="scss">
.photos-head__wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>