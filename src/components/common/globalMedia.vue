<script setup lang="ts">
import GlobalMediaContent from "@/components/common/globalMediaContent.vue";
import {onMounted, onUnmounted, ref} from "vue";
import {lockScroll, unlockScroll} from "@/helpers/popup";
import {usePhotoStore} from "@/stores/photo";
import {useRoute} from "vue-router";
import {useNotificationStore} from "@/stores/notifications";

const route = useRoute()

const phStore = usePhotoStore();
const ntfStore = useNotificationStore();

onMounted(async () => {
  lockScroll();
  if (!route.query.r || typeof route.query.r !== 'string') return

  await phStore.getPhotoGList(route.query.r)

  if (phStore.phError) {
    ntfStore.addNotification('error', phStore.phError, 3000)
  }
})

onUnmounted(() => {
  unlockScroll()
  phStore.phGList = null;
  phStore.currentGListIndex = null;
})

</script>

<template>
<div class="media__wrapper">
  <global-media-content/>
</div>
</template>

<style scoped lang="scss">
.media__wrapper {
  position: fixed;
  inset: 0;
  z-index: 10003;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}
</style>