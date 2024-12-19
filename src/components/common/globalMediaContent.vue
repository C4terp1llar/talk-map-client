<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from "vue";
import {onClickOutside} from "@vueuse/core";
import {useRoute, useRouter} from "vue-router";
import {usePhotoStore} from "@/stores/photo";
import {useNotificationStore} from "@/stores/notifications";
import GPhotoContentSkeleton from "@/components/skeletons/gPhotoContentSkeleton.vue";
import PhotoNotFound from "@/components/photos/photoNotFound.vue";
import PhotoImage from "@/components/photos/photoImage.vue";
import PhotoHeading from "@/components/photos/photoHeading.vue";
import PhotoReactions from "@/components/photos/photoReactions.vue";
import PhotoFooter from "@/components/photos/photoFooter.vue";
import GlobalMediaContentItem from "@/components/common/globalMediaContentItem.vue";

const phStore = usePhotoStore();
const ntfStore = useNotificationStore();

const router = useRouter()
const route = useRoute()

const mediaContentRef = ref<HTMLElement | null>(null);

onClickOutside(mediaContentRef, e => handleClose())
const handleClose = () => {
  router.push({query: {r: undefined}});
}

onMounted(async () => {
  if (!route.query.r || typeof route.query.r !== 'string') return

  await phStore.getPhoto(route.query.r)

  if (phStore.phError) {
    ntfStore.addNotification('error', phStore.phError, 3000)
  }
})

onUnmounted(() => phStore.currentPhoto = null)
</script>

<template>
  <div class="media-content__wrapper" ref="mediaContentRef">

    <button @click="handleClose" class="close__btn">
      <v-icon class="desktop_icon" :size="24" >mdi-close</v-icon>
      <div class="mobile_icon">
        <v-icon :size="24" color="green">mdi-arrow-left-bold-outline</v-icon>
        <span>Назад</span>
      </div>
    </button>

    <global-media-content-item v-if="phStore.currentPhoto && typeof phStore.currentGListIndex === 'number' && phStore.phGList?.length && !phStore.phPending"/>

    <photo-not-found class="m-auto" v-if="!phStore.currentPhoto && !phStore.phGList?.length && !phStore.phPending"/>

    <g-photo-content-skeleton v-if="phStore.phPending"/>
  </div>
</template>

<style scoped lang="scss">
.media-content__wrapper {
  height: 80vh;
  width: 80vw;

  box-shadow: 0 1px 10px currentColor;
  background: rgb(var(--v-theme-background));
  border-radius: 15px;
  padding: 10px;

  position: relative;
  display: flex;
  flex-direction: column;

  .media-content{
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  @media screen and (max-width: 650px) {
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    padding: 5px;
  }
}

.close__btn {
  position: absolute;
  top: 5px;
  right: 5px;
  opacity: .7;
  transition: 0.3s;
  display: flex;
  align-items: center;
  z-index: 5;

  @media (max-width: 650px) {
    position: relative;
    width: 100%;
    display: block;
    padding: 5px;
    top: unset;
    right: unset;
    .desktop_icon{
      display: none;
    }
    .mobile_icon{
      display: flex !important;
    }
  }
  .mobile_icon{
    display: none;
    align-items: center;
    justify-content: space-between;
  }
  &:hover {
    opacity: 1;
  }
}

</style>