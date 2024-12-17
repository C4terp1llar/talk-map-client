<script setup lang="ts">
import {component as Viewer} from 'v-viewer'

interface Props {
  url: string
}

const props = defineProps<Props>()

const opts = {
  "inline": true, "button": false, "navbar": false, "title": false, "toolbar": true, "tooltip": false, "movable": true, "zoomable": true, "rotatable": false, "scalable": true, "transition": false, "fullscreen": false, "keyboard": true
}
</script>

<template>
  <div class="media-content__img">
    <viewer class="viewer" :options="opts">
      <img class="img" :src="props.url" />
    </viewer>
  </div>
</template>

<style scoped lang="scss">
.media-content__img{
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid currentColor;
  border-radius: 15px;
  padding: 15px;
  overflow: hidden;
  position: relative;

  .img{
    opacity: 0;
    max-height: 100%;
    max-width: 100%;
  }
}
</style>