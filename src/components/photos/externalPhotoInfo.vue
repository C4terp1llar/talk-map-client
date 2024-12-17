<script setup lang="ts">
import {useExternalUserStore} from "@/stores/externalUser";
import {useNotificationStore} from "@/stores/notifications";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";

const externalUserStore = useExternalUserStore();
</script>

<template>
  <div class="photo__owner">
    <h5 class="ma-0">Фотографии
      <router-link
          v-if="externalUserStore.main"
          class="nickname-link"
          :style="{ color: externalUserStore.main?.nickname_color ? externalUserStore.main?.nickname_color : 'currentColor' }"
          :to="{name: 'friends-user', params: {id: externalUserStore.main?._id}}"
      >
         {{ externalUserStore.main?.nickname }}
      </router-link>
    </h5>
    <skeleton-loader v-if="externalUserStore.pending"/>
  </div>
</template>

<style scoped lang="scss">
.photo__owner{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.nickname-link{
  font-weight: 600;
  font-size: 18px;
}

</style>