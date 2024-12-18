<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { component as Viewer } from 'v-viewer'
import SkeletonLoader from "@/components/common/skeletonLoader.vue"
import {usePhotoStore} from "@/stores/photo";
import {useNotificationStore} from "@/stores/notifications";

interface Props {
  url: string
}

const props = defineProps<Props>()

const phStore = usePhotoStore();
const ntfStore = useNotificationStore();

const opts = {
  "inline": true,
  "button": false,
  "navbar": false,
  "title": false,
  "toolbar": true,
  "tooltip": false,
  "movable": true,
  "zoomable": true,
  "rotatable": false,
  "scalable": true,
  "transition": false,
  "fullscreen": false,
  "keyboard": true
}

const isLoading = ref(true)
const imageUrl = ref('')

onMounted(async () => {
  try {
    const response = await axios.get(props.url, { responseType: 'blob' })
    imageUrl.value = URL.createObjectURL(response.data)
  } catch (error) {
    imageUrl.value = '/img/load-error.gif';
    ntfStore.addNotification('error', 'Ошибка при загрузке фото, обновите страницу или попробуйте позже', 3000)
    console.error('Ошибка при загрузке изображения')
  } finally {
    isLoading.value = false
  }
})


const handleSlide = async (mode: 'next' | 'prev') => {
  if (mode === 'next') {
    await phStore.nextGPhoto()
  }
  else{
    await phStore.prevGPhoto()
  }
}
</script>

<template>
  <div class="media-content__img">
    <SkeletonLoader v-if="isLoading" />

    <viewer v-if="!isLoading" class="viewer" :options="opts">
      <img :src="imageUrl" class="img" alt="Фотография пользователя" />
    </viewer>

    <v-btn size="small" icon @click="handleSlide('prev')" v-if="phStore.phGList && phStore.phGList?.length > 1" class="media-content__control control__prev">
      <v-icon>mdi-arrow-left-bold</v-icon>
    </v-btn>

    <v-btn size="small" icon @click="handleSlide('next')" v-if="phStore.phGList && phStore.phGList?.length > 1" class="media-content__control control__next">
      <v-icon>mdi-arrow-right-bold</v-icon>
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
.media-content__img {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid currentColor;
  border-radius: 15px;

  overflow: hidden;
  position: relative;

  .img {
    opacity: 0;
    max-height: 100%;
    max-width: 100%;
    transition: opacity 0.3s ease;
  }
}

.media-content__control{
  position: absolute;
  &.control__next{
    right: 5px;
  }
  &.control__prev{
    left: 5px;
  }
  &.control__next, &.control__prev{
    @media (max-width: 650px) {
      bottom: 5px !important;
    }
  }
}
</style>
