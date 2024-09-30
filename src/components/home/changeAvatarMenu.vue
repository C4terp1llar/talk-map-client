<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useImagePopupStore } from "@/stores/imagePopup";
import { useUserStore } from "@/stores/user";
import {useConvertUrlStore} from "@/stores/convertUrl";

const isMenuVisible = ref<boolean>(false);

const imagePopupStore = useImagePopupStore();
const userStore = useUserStore();
const convertUrlStore = useConvertUrlStore();

const clickOutside = () => {
  if (isMenuVisible.value) {
    isMenuVisible.value = false;
  }
};

const refAvatarChangeMenu = ref<HTMLDivElement | null>(null);
onClickOutside(refAvatarChangeMenu, clickOutside);

const handleChangeAvatar = () => {
  clickOutside();
  imagePopupStore.openPopup('single', 'avatar', 'upload');
};

const handleRefreshAvatar = async () => {
  const avatarUrl = userStore?.userAvatar || userStore.mainUserInfo?.avatar;
  if (avatarUrl){
    const base64Avatar = await convertUrlStore.urlToBase64(avatarUrl);
    clickOutside();
    imagePopupStore.cropImageData = [base64Avatar];
    imagePopupStore.openPopup('single', 'avatar', 'crop');
  }
};
</script>

<template>
  <div class="change-avatar-wrapper" ref="refAvatarChangeMenu">

    <button class="change-avatar" @click="isMenuVisible = !isMenuVisible">
      <v-icon>mdi-pencil</v-icon>
    </button>


    <v-scroll-y-transition>
      <div class="change-avatar-menu" v-if="isMenuVisible">
        <v-btn
            variant="text"
            class="text-none w-100 justify-content-start"
            prepend-icon="mdi-pencil-outline"
            @click="handleChangeAvatar"
        >
          Изменить
        </v-btn>

        <v-btn
            variant="text"
            class="text-none w-100 justify-content-start"
            prepend-icon="mdi-crop"
            @click="handleRefreshAvatar"
            :loading="convertUrlStore.pending"
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
    box-shadow: 0 1px 10px currentColor;
    backdrop-filter: blur(2px);
  }
}

.change-avatar-menu {
  position: absolute;
  z-index: 10;
  padding: 15px;
  border-radius: 15px;
  box-shadow: 0 1px 10px currentColor;
  background: rgb(var(--v-theme-background));
  margin-top: 155px;

  @media screen and (max-width: 850px) {
    margin-top: 105px;
  }
}
</style>
