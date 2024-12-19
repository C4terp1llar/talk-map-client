<script setup lang="ts">
import {useRouter} from "vue-router";
import {useExternalUserStore} from "@/stores/externalUser";
import {usePhotoStore} from "@/stores/photo";
import PhotosList from "@/components/photos/photosList.vue";
import {onMounted, onUnmounted} from "vue";
import ShortPhotoSkeleton from "@/components/skeletons/shortPhotoSkeleton.vue";
import TextDivider from "@/components/common/textDivider.vue";
import ScrollableContainer from "@/components/common/scrollableContainer.vue";
import PhotosListItem from "@/components/photos/photosListItem.vue";
import {useNotificationStore} from "@/stores/notifications";

const router = useRouter()

const photoStore = usePhotoStore()
const notificationStore = useNotificationStore()

onMounted(async () => {
  await photoStore.getPhotos('load', 5)

  if (photoStore.photoError) {
    notificationStore.addNotification('error', photoStore.photoError, 3000)
  }
})

onUnmounted(() => photoStore.photos = null)

</script>

<template>
  <div class="photos-internal__wrapper">
    <div class="photos-internal" v-if="!photoStore.loadPending">
      <text-divider class="mb-2" text="Фотографии"/>

      <div v-if="photoStore.photos && photoStore.photos.length">
        <scrollable-container mode="phShort">
          <div class="photos">
            <photos-list-item :without-actions="true" mode="internal" :photos="photoStore.photos" :short="true"/>
          </div>
        </scrollable-container>
        <button class="load-more-btn__link m-auto mt-2" @click="router.push({name: 'photos'})">
          <v-icon>mdi-dots-horizontal</v-icon>
        </button>
      </div>
      <div class="__no-photos" v-else>
        <h6 class="text-center">Фотографий пока нет 📸</h6>
        <v-btn class="text-none" @click="router.push({name: 'photos'})">Добавить</v-btn>
      </div>
    </div>
    <short-photo-skeleton v-if="photoStore.loadPending"/>
  </div>
</template>

<style scoped lang="scss">
.photos-internal__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 10px currentColor;
  border-radius: 15px;
  padding: 10px;
  background: rgb(var(--v-theme-background));
  text-align: center;
  height: fit-content;
  width: 100%;

  .photos-internal{
    width: 100%;
    .photos{
      display: flex;
      flex-wrap: nowrap;
      gap: 10px;
    }
    .__no-photos{
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 5px;
    }
  }
}
</style>