<script setup lang="ts">
import type {Photo} from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {usePhotoStore} from "@/stores/photo";
import {useNotificationStore} from "@/stores/notifications";
import CircularLoader from "@/components/common/circularLoader.vue";

interface Props {
  photos: Photo[]
}

const props = defineProps<Props>()

const photoStore = usePhotoStore()
const notificationStore = useNotificationStore()

const handleDelete = async (id: string) => {
  await photoStore.deletePhoto(id);

  if (photoStore.deleteError) {
    notificationStore.addNotification('error', photoStore.deleteError, 3000)
  } else {
    await photoStore.getPhotos('load', undefined, undefined, true);
  }
}
</script>

<template>
  <div class="photos-list__item" v-for="p in props.photos" :key="p._id">
    <v-img class="photos-list__item-img" :src="p.url" cover>
      <template v-slot:placeholder>
        <skeleton-loader/>
      </template>
    </v-img>
    <div class="photos-list__content-controls">
      <button @click="handleDelete(p._id)" class="delete-img">
        <v-icon v-if="!photoStore.deletePending" color="red">mdi-trash-can-outline</v-icon>
        <circular-loader :size="20" v-if="photoStore.deletePending"/>
      </button>
    </div>
    <button @click="console.log('open')" class="photos-list__content-action"></button>
  </div>
</template>

<style scoped lang="scss">
.photos-list__item {
  width: 250px;
  height: 250px;
  overflow: hidden;
  border-radius: 15px;
  border: 2px solid currentColor;
  position: relative;

  .photos-list__item-img {
    width: 250px;
    height: 250px;
  }

  .photos-list__content-controls {
    z-index: 10;
    position: absolute;
    padding: 5px 5px;
    border-radius: 5px;
    background-color: rgba(211, 211, 211, 0.25);
    top: 5px;
    right: 5px;
  }

  .photos-list__content-action {
    z-index: 5;
    position: absolute;
    inset: 0;
  }
}


.delete-img {
  opacity: .7;
  transition: 0.3s;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 1;
  }
}
</style>