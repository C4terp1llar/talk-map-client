<script setup lang="ts">
import {useAvatarSliderStore} from "@/stores/regAvatarSlider";
import {onMounted} from "vue";
import {useNotificationStore} from "@/stores/notifications";

const regAvatarSliderStore = useAvatarSliderStore();
const notificationStore = useNotificationStore()

onMounted(async () => {
  await regAvatarSliderStore.handleGetCommonAvatars();

  if (regAvatarSliderStore.error){
    notificationStore.addNotification('error', regAvatarSliderStore.error, 3000)
  }
});
</script>

<template>
  <div class="slider-wrapper">
    <v-avatar v-bind="$attrs" size="200" class="avatar">
      <v-carousel
          v-if="!regAvatarSliderStore.pending"
          v-model="regAvatarSliderStore.currentSlide"
          :show-arrows="false"
          height="200"
          hide-delimiters
      >
        <v-carousel-item
            v-for="(item, i) in regAvatarSliderStore.avatars"
            :key="i"
        >
          <v-img :src="item" height="200px"></v-img>
        </v-carousel-item>
      </v-carousel>
      <template v-else>
        <v-progress-circular
            class="align-self-center"
            color="green"
            indeterminate
            size="large"
        ></v-progress-circular>
      </template>
    </v-avatar>
    <div class="controls">
      <v-btn
          icon="mdi-chevron-left"
          size="small"
          color="green"
          variant="plain"
          @click="regAvatarSliderStore.prevSlide()"
      ></v-btn>
      <v-btn
          icon="mdi-chevron-right"
          color="green"
          size="small"
          variant="plain"
          @click="regAvatarSliderStore.nextSlide()"
      ></v-btn>
    </div>
  </div>
</template>

<style scoped>
.slider-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  border: 2px solid green;
  z-index: 10;
}

.controls {
  position: absolute;
  display: flex;
  gap: 210px;
  z-index: 5;
}
</style>
