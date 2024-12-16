<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {onClickOutside} from "@vueuse/core";
import {useRoute, useRouter} from "vue-router";
import {usePhotoStore} from "@/stores/photo";
import {useNotificationStore} from "@/stores/notifications";
import {component as Viewer} from 'v-viewer'

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

    <div class="media-content__img">

      <viewer class="viewer" v-if="ph" :options="opts">
        <img class="img" v-if="ph" :src="ph.url" />
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
  padding: 15px;

  @media screen and (max-width: 650px) {
    width: 100%;
    height: calc(100% - 10px);
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

    .img{
      opacity: 0;
      max-height: 100%;
      max-width: 100%;
    }
  }
}


</style>