<script setup lang="ts">

import ShortPhotoSkeleton from "@/components/skeletons/shortPhotoSkeleton.vue";
import TextDivider from "@/components/common/textDivider.vue";
import ScrollableContainer from "@/components/common/scrollableContainer.vue";
import PhotosListItem from "@/components/photos/photosListItem.vue";
import {useRouter} from "vue-router";
import {usePhotoStore} from "@/stores/photo";
import {useExternalUserStore} from "@/stores/externalUser";

interface Props {
  mode: 'internal' | 'external',
  short?: boolean,
}
const props = defineProps<Props>()

const router = useRouter()
const photoStore = usePhotoStore()
const externalUserStore = useExternalUserStore();
</script>

<template>
  <div class="photos-external__wrapper" v-if="mode === 'external' && externalUserStore.main && !externalUserStore.pending && !photoStore.loadPending">
    <text-divider class="mb-2" text="Фотографии"/>

    <div v-if="photoStore.photos && photoStore.photos.length">
      <scrollable-container mode="phShort">
        <div class="photos__external">
          <photos-list-item  :mode="props.mode" :photos="photoStore.photos" :short="props.short"/>
        </div>
      </scrollable-container>
      <button class="load-more-btn__link m-auto mt-2" @click="router.push({name: 'photos-user', params: {uid: externalUserStore.main._id}})">
        <v-icon>mdi-dots-horizontal</v-icon>
      </button>
    </div>
    <div v-else>
      <h6 class="text-center">Фотографий пока нет 📸</h6>
    </div>

  </div>

  <short-photo-skeleton v-if="externalUserStore.pending || photoStore.loadPending"/>
</template>

<style scoped lang="scss">
.photos-external__wrapper{
  width: 100%;
  .photos__external{
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
  }
}
</style>