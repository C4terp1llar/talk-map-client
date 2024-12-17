<script setup lang="ts">
import {computed, onMounted, onUnmounted} from "vue";
import {usePhotoStore} from "@/stores/photo";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {useNotificationStore} from "@/stores/notifications";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";
import PhotosNotFound from "@/components/photos/photosNotFound.vue";
import PhotosListItem from "@/components/photos/photosListItem.vue";
import type {Photo} from "@/helpers/interfaces";

interface Props {
  mode: 'internal' | 'external',
  uid?: string
}
const props = defineProps<Props>()

const photoStore = usePhotoStore()
const notificationStore = useNotificationStore()

onMounted(async () => {
  await uploadData('load')
})

onUnmounted(async () => {
  photoStore.photos = null;
  photoStore.hasMore = false;
  photoStore.currentPage = 1;
})

const moreFlag = computed(() => {
  return (
      photoStore.photos &&
      photoStore.photos.length === photoStore.perPage * photoStore.currentPage &&
      photoStore.hasMore &&
      !photoStore.loadPending &&
      !photoStore.loaMorePending
  )
})

const uploadData = async (mode: 'load' | 'load-more') => {
  if (!moreFlag && mode === 'load-more') return

  let requester

  if (props.mode == 'external' && props.uid) {
    requester = props.uid
  }

  await photoStore.getPhotos(mode, undefined, requester)

  if (photoStore.photoError) {
    notificationStore.addNotification('error', photoStore.photoError, 3000)
  }
}

</script>

<template>
  <div class="photos-list__wrapper">
    <lazy-placeholder-loader v-if="photoStore.loadPending"/>


    <div class="photos-list__content-wrapper" v-if="!photoStore.loadPending && photoStore.photos && photoStore.photos.length">

      <div class="photos-list__content">
        <photos-list-item :mode="props.mode" :photos="photoStore.photos"/>
      </div>


      <div class="controls  mt-1 d-flex justify-content-center">
        <v-btn
            color="green"
            class="text-none"
            variant="text"
            @click="uploadData('load-more')"
            v-if="moreFlag"
        >
          Еще
        </v-btn>
      </div>


      <pagination-dot-loader class="mt-1" v-if="photoStore.loaMorePending"/>
    </div>

    <photos-not-found class="align-self-center" v-if="!photoStore.loadPending && photoStore.photos && !photoStore.photos.length"/>

  </div>
</template>

<style scoped lang="scss">
.photos-list__wrapper {
  position: relative;
  box-shadow: 0 1px 10px currentColor;
  border-radius: 15px;
  background: rgb(var(--v-theme-background));
  height: 100%;
  width: 100%;
  padding: 10px;

  display: grid;

  .photos-list__content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
}
</style>