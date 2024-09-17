<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, ref} from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import {useRegistrationStore} from "@/stores/regSteps";
import AvatarSlider from "@/components/registerSteps/common/AvatarSlider.vue";
import {useAvatarSliderStore} from "@/stores/regAvatarSlider";
import {useNotificationStore} from "@/stores/notifications";
import {useRouter} from "vue-router";

const router = useRouter()

const regStore = useRegistrationStore();
const regAvatarSliderStore = useAvatarSliderStore();
const notificationStore = useNotificationStore();

const imageUrl = ref<string | ArrayBuffer | null>(null);
const showModal = ref(false);
const cropper = ref<Cropper | null>(null);
const imageElement = ref<HTMLImageElement | null>(null);

const chooseCommonImg = ref<boolean>(false);

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imageUrl.value = reader.result;
      showModal.value = true;
    };
    reader.readAsDataURL(file);
  }
};

const initializeCropper = () => {
  nextTick(() => {
    if (imageElement.value && imageUrl.value) {
      cropper.value?.destroy();
      cropper.value = new Cropper(imageElement.value, {
        background: false,
        dragMode: "move",
        viewMode: 3,
        aspectRatio: 1,
        cropBoxMovable: false,
        cropBoxResizable: false,
        minCropBoxHeight: 280,
        minCropBoxWidth: 280,
        toggleDragModeOnDblclick: false, // настроект дх взчл с прошлого проекта, мб переделать размер окна зума чтобы было не в упор
      });// ps поправил размер до 280
    }
  });
};

const handleCrop = () => {
  if (cropper.value) {
    imageUrl.value = cropper.value.getCroppedCanvas().toDataURL(); // берем зумированную картинку если олна есть и записываем в модель картинки
    showModal.value = false;
  }
};

const handleCancel = () => {
  imageUrl.value = null;//  закрываем модалку с выбором зума картинки bи обнудяем картинку
  showModal.value = false;
  cropper.value = null;
};

const handleSubmit = async () => {

  if (chooseCommonImg.value){
    regStore.setNewUserAvatar(regAvatarSliderStore.avatars[regAvatarSliderStore.currentSlide])

    await handleRegistration();
  }else if(cropper.value && !chooseCommonImg.value){
    const avatar = imageUrl.value = cropper.value.getCroppedCanvas().toDataURL();
    regStore.setNewUserAvatar(avatar)

    await handleRegistration();
  }

  // если флаг на готовый аватары false или нет загруженной картинки просто ретернимся
  return;
};

const handleRegistration = async () => {
  await regStore.regNewUser()

  if(!regStore.error){
    await router.push('/app');
    notificationStore.addNotification('success', `Добро пожаловать, ${regStore.newUserNickname}!`, 3000)
    regStore.resetSteps();
    regStore.clearAllData();
  }else{
    notificationStore.addNotification('error', regStore.error, 3000)
  }
}

onMounted(() => {
  if (showModal.value) {
    initializeCropper();
  }
});
onUnmounted(() => {
  if (cropper.value) {
    cropper.value.destroy();
  }
});
</script>

<template>
  <!--  кривовато через рефы. но хз как по другому-->
  <!--  срц ругается изза того что можно передатиь от кропера массив байтов или нал поэтому пришлось сделать проверку typeof imageUrl === 'string' ? imageUrl : '' -->

  <div v-if="!showModal && !chooseCommonImg" @click="$refs.fileInput.click()" class="avatar-wrapper align-self-center">
    <div class="avatar-container">
      <!--    если есть картинка показываем ее-->
      <img v-if="imageUrl" class="avatar-preview" :src="typeof imageUrl === 'string' ? imageUrl : ''" alt="Аватарка"/>

      <!--    если картинки нет то просто кружок с камекрой для выбора-->
      <v-avatar v-else size="200" class="avatar-preview">
        <v-icon color="green" size="large">mdi-camera</v-icon>
      </v-avatar>
      <!--оверлей из-за того, чтобы у картинки не менять фон или опаситти-->
      <div class="avatar-preview-overlay"></div>
    </div>
    <input ref="fileInput" type="file" @change="handleImageUpload" accept="image/*" style="display: none;"/>
  </div>

  <avatar-slider v-if="!showModal && chooseCommonImg"/>

  <v-btn
      v-if="!showModal"
      variant="plain"
      class="text-none w-100 align-self-center mt-1"
      @click="chooseCommonImg = !chooseCommonImg"
  >
    {{ chooseCommonImg ? 'Загрузить свой аватар' : 'Выбрать из готовых' }}
  </v-btn>

  <v-form v-if="!showModal" @submit.prevent="handleSubmit" class="w-100 d-flex flex-column gap-3">

    <div class="d-flex flex-column gap-1 mt-4">

      <v-btn
          class="text-none flex-1-0"
          type="submit"
          variant="outlined"
          :disabled="regStore.pending"
      >
        <template v-if="regStore.pending">
          <v-progress-circular
              class="align-self-center"
              color="green"
              indeterminate
              size="small"
          ></v-progress-circular>
        </template>
        <template v-else>
          Завершить регистрацию
        </template>
      </v-btn>
      <v-btn
          class="text-none flex-1-0"
          @click="regStore.prevStep()"
          :disabled="regStore.pending"
          variant="plain"
          color="green"
      >
        Вернуться назад
      </v-btn>
    </div>
  </v-form>

  <div v-if="showModal" class="w-100">
    <div class="cropper-container">
      <img ref="imageElement" :src="typeof imageUrl === 'string' ? imageUrl : ''" alt="Preview"
           @load="initializeCropper"/>
    </div>
    <div class="d-flex flex-column gap-1 mt-5">

      <v-btn
          @click="handleCrop"
          class="text-none flex-1-0"
          variant="outlined"
      >
        Подтвердить
      </v-btn>
      <v-btn
          @click="handleCancel"
          class="text-none flex-1-0"
          type="submit"
          variant="plain"
          color="green"
      >
        Отмена
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
/*Стили для аватарки*/
.avatar-wrapper {
  width: 200px;
  height: 200px;
}

.avatar-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
}

.avatar-preview, .avatar-preview-overlay {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px solid green;
  cursor: pointer;
}

.avatar-preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0);
  transition: 0.3s;
}

.avatar-container:hover .avatar-preview-overlay {
  background-color: rgba(0, 0, 0, 0.2);
}

/* стили для  КРОППЕРА */

.cropper-container {
  overflow: hidden;
  border-radius: 15px;
  border: 1px solid black;
}

.cropper-container img {
  width: 300px;
  height: 300px;
}
</style>