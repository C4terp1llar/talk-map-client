<script setup lang="ts">
import type {Photo} from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {usePhotoStore} from "@/stores/photo";
import {useNotificationStore} from "@/stores/notifications";
import CircularLoader from "@/components/common/circularLoader.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";


interface Props {
  photos: Photo[],
  mode: 'internal' | 'external',
  short?: boolean,
  withoutActions?: boolean
}

const props = defineProps<Props>()
const router = useRouter();

const photoStore = usePhotoStore()
const notificationStore = useNotificationStore()

const currentDeletePending = ref<string>('')

const handleDelete = async (id: string) => {
  currentDeletePending.value = id
  await photoStore.deletePhoto(id);

  if (photoStore.deleteError) {
    notificationStore.addNotification('error', photoStore.deleteError, 3000)
  } else {
    await photoStore.getPhotos('load', undefined, undefined, true);
  }
  currentDeletePending.value = ''
}

const handleOpenMedia = (id: string) => {
  router.push({query: {r: id}})
}
</script>

<template>
  <div :class="['photos-list__item', props.short ? '__short' : '']" v-for="p in props.photos" :key="p._id">
    <v-img class="photos-list__item-img" :src="p.url" cover>
      <template v-slot:placeholder>
        <skeleton-loader/>
      </template>
    </v-img>
    <div class="photos-list__content-controls" v-if="props.mode === 'internal' && !props.withoutActions">
      <button @click="handleDelete(p._id)" class="delete-img">
        <v-icon :size="20" v-if="currentDeletePending !== p._id" color="red">mdi-trash-can-outline</v-icon>
        <circular-loader :size="20" v-if="currentDeletePending === p._id"/>
      </button>
    </div>
    <button @click="handleOpenMedia(p._id)" class="photos-list__content-action"></button>
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

  &.__short{
    width: 85px;
    height: 85px;
  }

  .photos-list__item-img {
    width: inherit;
    height: inherit;
  }

  .photos-list__content-controls {
    z-index: 10;
    position: absolute;
    padding: 5px;
    border-radius: 5px;
    background-color: rgba(211, 211, 211, 0.25);
    top: 5px;
    right: 5px;

    @media (max-width: 650px){
      padding: 2px;
    }
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

.photos-list__item:not(.__short){
  @media (max-width: 1400px) {
    width: 230px;
    height: 230px;
  }
  @media (max-width: 1270px) {
    width: 200px;
    height: 200px;
  }

  @media (max-width: 650px) {
    width: 150px;
    height: 150px;
  }

  @media (max-width: 400px) {
    width: 120px;
    height: 120px;
  }
}
</style>