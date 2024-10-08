<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useImagePopupStore } from "@/stores/imagePopup";
import { useUserStore } from "@/stores/user";
import {useNotificationStore} from "@/stores/notifications";

interface Props {
  isPreview: boolean,
}
const props = defineProps<Props>()

const isMenuVisible = ref<boolean>(false);

const imagePopupStore = useImagePopupStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore()

const clickOutside = () => {
  if (isMenuVisible.value) {
    isMenuVisible.value = false;
  }
};

const refAvatarChangeMenu = ref<HTMLDivElement | null>(null);
onClickOutside(refAvatarChangeMenu, clickOutside);

const handleChangeAvatar = () => {
  if (userStore.originalPending || userStore.avatarPending) return

  clickOutside();
  imagePopupStore.openPopup('single', 'avatar', 'upload', 'uploadCrop');
};

const handleRefreshAvatar = async () => {
  if (userStore.originalPending || userStore.avatarPending) return

  const origImg = await userStore.getOriginalImg('getOriginalAvatar')
  imagePopupStore.cropImageData = [origImg];

  if(userStore.originalError){
    notificationStore.addNotification('error', userStore.originalError, 5000)
    return
  }

  clickOutside();
  imagePopupStore.openPopup('single', 'avatar', 'crop', 'onlyCrop');
};
</script>

<template>
  <div class="change-avatar-wrapper" ref="refAvatarChangeMenu">

    <button :class="props.isPreview ? 'change-avatar__preview' : 'change-avatar'" @click="isMenuVisible = !isMenuVisible" :disabled="userStore.originalPending || userStore.avatarPending">
      <v-icon class="change-icon">mdi-camera-outline</v-icon>
    </button>


    <v-scroll-y-transition>
      <div class="change-avatar-menu" v-if="isMenuVisible">
        <v-btn
            variant="text"
            class="text-none w-100 justify-content-start"
            prepend-icon="mdi-pencil-outline"
            @click="handleChangeAvatar"
            v-if="userStore.mainUserInfo?.avatar || userStore.userAvatar"
        >
          Изменить
        </v-btn>

        <v-btn
            variant="text"
            class="text-none w-100 justify-content-start"
            prepend-icon="mdi-crop"
            @click="handleRefreshAvatar"
            :loading="userStore.originalPending"
            :disabled="userStore.originalPending"
            v-if="userStore.mainUserInfo?.avatar || userStore.userAvatar"
        >
          Обновить
        </v-btn>
      </div>
    </v-scroll-y-transition>
  </div>
</template>

<style scoped lang="scss">
.change-avatar-wrapper {
  inset: 0;
  position: absolute;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  padding: 4px;
}

.change-avatar {
  width: 100%;
  height: 100%;
  z-index: 10;
  border-radius: 50%;
  opacity: 0;
  transition: 0.3s;

  &:hover {
    opacity: 1;
    backdrop-filter: blur(5px);
  }
}

.change-avatar__preview{
  width: 100%;
  height: 100%;
  z-index: 10;
  border-radius: 50%;
  transition: 0.3s;

  &:hover {
    backdrop-filter: blur(5px);
  }
}

.change-icon {
  color: currentColor;
  filter: drop-shadow(0 0 5px currentColor);
  font-size: 35px;
}


.change-avatar-menu {
  position: absolute;
  z-index: 10;
  padding: 15px;
  border-radius: 15px;
  box-shadow: 0 1px 10px currentColor;
  background: rgb(var(--v-theme-background));
  margin-top: 150px;

  @media screen and (max-width: 850px) {
    margin-top: 100px;
  }
}
</style>
