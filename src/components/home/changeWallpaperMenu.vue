<script setup lang="ts">
import {ref} from "vue";
import {onClickOutside} from "@vueuse/core";
import {useImagePopupStore} from "@/stores/imagePopup";
import {useUserStore} from "@/stores/user";
import {useConvertUrlStore} from "@/stores/convertUrl";

const imagePopupStore = useImagePopupStore();
const userStore = useUserStore()
const convertUrlStore = useConvertUrlStore();

const isMenuVisible = ref<boolean>(false)

const clickOutside = () => {
  if (isMenuVisible.value) {
    isMenuVisible.value = !isMenuVisible.value
  }
}

const refWallpaper = ref<HTMLDivElement | null>(null);
onClickOutside(refWallpaper, e => clickOutside())

const handleChangeWallpaper = () => {
  clickOutside()
  imagePopupStore.openPopup('single', 'wallpaper', 'upload')
}

const handleRefreshWallpaper = async () => {
  const wallpaperUrl = userStore?.userWallpaper || userStore.mainUserInfo?.wallpaper
  if (wallpaperUrl){
    const base64Avatar = await convertUrlStore.urlToBase64(wallpaperUrl);
    clickOutside();
    imagePopupStore.cropImageData = [base64Avatar];
    imagePopupStore.openPopup('single', 'wallpaper', 'crop')
  }
}
</script>

<template>
  <div class="change-wallpaper-wrapper" ref="refWallpaper">
    <button class="change-wallpaper" @click="isMenuVisible = !isMenuVisible">
      <v-icon>mdi-pencil</v-icon>
    </button>

    <v-scroll-y-transition>
      <div class="change-wallpaper-menu" v-if="isMenuVisible">
        <v-btn
            @click="handleChangeWallpaper"
            variant="text"
            class="text-none w-100 justify-content-start"
            prepend-icon="mdi-pencil-outline"
        >
          Изменить
        </v-btn>

        <v-btn
            variant="text"
            class="text-none w-100 justify-content-start"
            prepend-icon="mdi-crop"
            @click="handleRefreshWallpaper"
            :loading="convertUrlStore.pending"
        >
          Обновить
        </v-btn>

        <v-btn
            variant="text"
            class="text-none w-100 justify-content-start"
            prepend-icon="mdi-delete-outline"
        >
          Удалить
        </v-btn>
      </div>
    </v-scroll-y-transition>
  </div>
</template>

<style scoped lang="scss">
.change-wallpaper-wrapper{
  right: 5px;
  top: 5px;
  position: absolute;
  border-radius: 50%;
  z-index: 10;

  display: flex;
  justify-content: center;

  .change-wallpaper {
    background: rgb(var(--v-theme-background));
    z-index: 10;
    padding: 5px;
    border-radius: 10px;
    opacity: .7;
    transition: 0.3s;

    &:hover {
      opacity: 1;
    }
  }

  .change-wallpaper-menu {
    position: absolute;
    padding: 15px;
    border-radius: 15px;
    box-shadow: 0 1px 10px currentColor;
    background: rgb(var(--v-theme-background));
    right: 0;
    margin-top: 40px;
  }
}

</style>