<script setup lang="ts">
import { ref, nextTick } from "vue";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import CmChangeGroupCover from "@/components/communications/cmChangeGroupCover.vue";
import {useCmStore} from "@/stores/cmStore";
import type {GroupConv, PersonalConv} from "@/helpers/interfaces";

interface Props {
  conv_id: string,
  type: string;
  cover: string;
  canChange: boolean;
}

const props = defineProps<Props>();

const cmStore = useCmStore();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedImage = ref<string | ArrayBuffer | null>(null);
const showCropper = ref(false);

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      selectedImage.value = reader.result;
      showCropper.value = true;
    };
    reader.readAsDataURL(file);
  }
};

const openFilePicker = () => {
  fileInput.value?.click();
};

const handleClose = () => {
  selectedImage.value = null;
  showCropper.value = false;
}

const pending = ref<boolean>(false)

const handleChangeCover = async (newCover: string | ArrayBuffer) => {
  handleClose()
  pending.value = true;
  const data = await cmStore.changeGroupCover(props.conv_id, newCover);
  pending.value = false;

  if (cmStore.selectedDialog && data){
    if (!isPersonalConv(cmStore.selectedDialog)){
      cmStore.selectedDialog.cover_url = data.cover_url;
    }
  }

  await cmStore.reloadMessagesAndDialogs();
}

function isPersonalConv(dialog: PersonalConv | GroupConv): dialog is PersonalConv {
  return "opponent" in dialog;
}
</script>

<template>
  <div class="change-group-conv-cover">
    <div class="__cover" v-if="!showCropper">
      <v-avatar class="__avatar">
        <v-img
            :src="cover"
            alt="conversation cover"
            cover
        >
          <template v-slot:placeholder>
            <skeleton-loader />
          </template>
        </v-img>
      </v-avatar>

      <v-btn class="change__cover" icon variant="elevated" v-if="type === 'group' && canChange" @click="openFilePicker" :disabled="pending" :loading="pending">
        <v-icon color="green" :size="20">mdi-pencil</v-icon>
      </v-btn>
    </div>

    <input ref="fileInput" type="file" @change="handleFileSelect" accept="image/*" style="display: none;" />

    <cm-change-group-cover v-if="showCropper && selectedImage" :image="selectedImage" @close="handleClose" @cover-select="img => handleChangeCover(img)"/>
  </div>
</template>

<style scoped lang="scss">
.change-group-conv-cover{
  width: 100%;
  .__avatar{
    height: 150px;
    width: 150px;
    @media (max-width: 650px){
      height: 100px;
      width: 100px;
    }
  }
  .__cover{
    width: fit-content;
    position: relative;
    margin: auto ;
    .change__cover{
      position: absolute;
      right: 5px;
      top: 0;
      z-index: 10;
      width: 35px;
      height: 35px;
      @media (max-width: 650px){
        right: -5px;
        width: 28px;
        height: 28px;
      }
    }
  }
}
</style>