<script setup lang="ts">
import { useCmStore } from "@/stores/cmStore";
import { type Component, onMounted, ref, computed } from "vue";
import type { MediaConvInfo } from "@/helpers/interfaces";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";
import NotFoundTemplate from "@/components/notFoundTemplate.vue";
import FileItem from "@/components/multimedia/mediaItems/fileItem.vue";
import VideoItem from "@/components/multimedia/mediaItems/videoItem.vue";
import ImageItem from "@/components/multimedia/mediaItems/imageItem.vue";

interface Props {
  mode: "image" | "video" | "files";
  convId: string;
  convType: string;
}

const props = defineProps<Props>();

const cmStore = useCmStore();

const page = ref<number>(1);
const LIMIT = 50;

const pending = ref<boolean>(false);
const pendingMore = ref<boolean>(false);
const hasMore = ref<boolean>(false);

const media = ref<MediaConvInfo[] | null>(null);

const uploadData = async (withoutPending?: boolean) => {
  if (hasMore.value) {
    page.value += 1;
  }

  const currPending = page.value < 2 ? pending : pendingMore;

  if (!withoutPending) {
    currPending.value = true;
  }
  const data = await cmStore.getGroupMedia(props.convId, props.mode, page.value, LIMIT);
  currPending.value = false;

  if (data && data.media) {
    hasMore.value = data.hasMore;
    if (page.value < 2) {
      media.value = data.media;
    } else {
      media.value?.push(...data.media);
    }
  }
};

onMounted(async () => {
  await uploadData()
});

const componentsMap: Record<"image" | "video" | "files", Component> = {
  image: ImageItem,
  video: VideoItem,
  files: FileItem,
};

const activeComponent = computed(() => componentsMap[props.mode]);

const mediaNamesMap = {
  image: "Фото",
  video: "Видео",
  files: "Файлов",
}
</script>

<template>
  <div class="cm-conv-info-media__wrapper">
    <lazy-placeholder-loader v-if="pending" />

    <div :class="['media-list', `__${mode}`]" v-if="!pending && media && media.length">
      <component
          v-for="mediaItem in media"
          :key="mediaItem._id"
          :is="activeComponent"
          :m="mediaItem"
      />
    </div>

    <div class="controls mt-1 d-flex justify-content-center" v-if="hasMore">
      <v-btn color="green" class="text-none" variant="text" @click="uploadData" v-if="hasMore && !pendingMore">
        Еще
      </v-btn>
      <pagination-dot-loader class="mt-1" v-if="pendingMore" />
    </div>

    <div class="d-flex h-100 align-self-center" v-if="!pending && media && !media.length">
      <not-found-template :text="`${mediaNamesMap[mode]} пока нет`" icon="mdi-multimedia" icon-color="green" :icon-size="28"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cm-conv-info-media__wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .media-list {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    &.__image{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 10px;
      grid-auto-flow: dense;
      @media (max-width: 1550px){
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      }
      @media (max-width: 800px){
        grid-template-columns: repeat(auto-fill, minmax(165px, 1fr));
      }
      @media (max-width: 550px){
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
      @media (max-width: 370px){
        grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
      }
    }

    &.__video{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 10px;
      grid-auto-flow: dense;
      @media (max-width: 1375px){
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
      @media (max-width: 1250px){
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      }
      @media (max-width: 800px){
        grid-template-columns: repeat(auto-fill, minmax(165px, 1fr));
      }
      @media (max-width: 550px){
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
      @media (max-width: 370px){
        grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
      }
    }

    &.__files{
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }

}
</style>
