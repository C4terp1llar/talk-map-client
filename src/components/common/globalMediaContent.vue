<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {onClickOutside} from "@vueuse/core";
import {useRoute, useRouter} from "vue-router";
import {usePhotoStore} from "@/stores/photo";
import {useNotificationStore} from "@/stores/notifications";
import {component as Viewer} from 'v-viewer'
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";

const phStore = usePhotoStore();
const ntfStore = useNotificationStore();

const router = useRouter()
const route = useRoute()

const mediaContentRef = ref<HTMLElement | null>(null);

onClickOutside(mediaContentRef, e => handleClose())
const handleClose = () => {
  router.push({query: {r: undefined, u: undefined}});
}

const ph = ref<any | null>(null)

onMounted(async () => {
  if (!route.query.r || !route.query.u || typeof route.query.r !== 'string' || typeof route.query.u !== 'string') return

  ph.value = await phStore.isPhotoExists(route.query.r, route.query.u)

  if (phStore.existError) {
    ntfStore.addNotification('error', phStore.existError, 3000)
  }
})

const opts = {
  "inline": true, "button": false, "navbar": false, "title": false, "toolbar": true, "tooltip": false, "movable": true, "zoomable": true, "rotatable": false, "scalable": true, "transition": false, "fullscreen": false, "keyboard": true
}

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

    <div class="media-content__img">

      <skeleton-loader v-if="phStore.existPending"/>

      <viewer class="viewer" v-if="ph && !phStore.existPending" :options="opts">
        <img class="img" :src="ph.url" />
      </viewer>

    </div>

  </div>
</template>

<style scoped lang="scss">
.media-content__wrapper {
  height: 80vh;
  width: 80vw;

  box-shadow: 0 1px 10px currentColor;
  background: rgb(var(--v-theme-background));
  border-radius: 15px;
  padding: 25px 10px 10px 10px;

  position: relative;

  @media screen and (max-width: 650px) {
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    padding: 5px;
  }

  .media-content__img{
    height: 90%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    border: 2px solid currentColor;
    border-radius: 15px;
    padding: 15px;
    overflow: hidden;
    position: relative;

    @media screen and (max-width: 650px) {
      height: auto;
      min-height: 50vh !important;
    }

    .img{
      opacity: 0;
      max-height: 100%;
      max-width: 100%;
    }
  }
}

.close__btn {
  position: absolute;
  top: 2px;
  right: 2px;
  opacity: .7;
  transition: 0.3s;
  display: flex;
  align-items: center;

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