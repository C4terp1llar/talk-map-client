<script setup lang="ts">
import type {PhotoG} from "@/helpers/interfaces";

interface Props {
  photo: PhotoG,
}

const props = defineProps<Props>()
</script>

<template>
  <div class="media-content__heading">
    <h6 class="ma-0" v-if="props.photo.mode === 'internal'">Ваша фотография</h6>
    <h6 class="ma-0" v-else>
      Фотография
      <router-link
          class="nickname-link"
          :style="{ color: props.photo.nickname_color ? props.photo.nickname_color : 'currentColor' }"
          :to="{name: 'friends-user', params: {id: props.photo.user_id}}"
      >
        {{ props.photo.nickname }}
      </router-link>
    </h6>
  </div>
</template>

<style scoped lang="scss">
.media-content__heading{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>