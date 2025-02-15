<script setup lang="ts">
import {useCmStore} from "@/stores/cmStore";
import type {GroupConv, PersonalConv} from "@/helpers/interfaces";
import {computed} from "vue";
import CmConvInfoHead from "@/components/communications/cmConvInfoHead.vue";
import {useRoute, useRouter} from "vue-router";
import CmConvInfoData from "@/components/communications/cmConvInfoData.vue";

const cmStore = useCmStore();

function isPersonalConv(dialog: PersonalConv | GroupConv): dialog is PersonalConv {
  return "opponent" in dialog;
}

const currentConv = computed(() => {
  const dialog = cmStore.selectedDialog;
  if (!dialog) return null;

  if (isPersonalConv(dialog)) {
    return {
      _id: dialog._id,
      cover: dialog.opponent.avatar,
      title: dialog.opponent.nickname,
      titleColor: dialog.opponent.nickname_color,
      type: 'personal',
      opponent: dialog.opponent._id
    }
  } else {
    return {
      _id: dialog._id,
      cover: dialog.cover_url,
      title: dialog.title,
      titleColor: null,
      type: 'group',
    }
  }
});

const router = useRouter()
const route = useRoute()

</script>

<template>
  <div class="cm-conv-info__wrapper styled-scroll" v-if="currentConv">
    <div class="back__btn">
      <button @click="router.push({query: {...route.query, info: undefined}})"></button>
      <v-icon :size="24" color="green">mdi-arrow-left-bold-outline</v-icon>
      <span>Назад</span>
    </div>
    <cm-conv-info-head :data="currentConv"/>
    <cm-conv-info-data :conv-type="currentConv.type" :conv-id="currentConv._id"/>
  </div>
</template>

<style scoped lang="scss">
.cm-conv-info__wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.back__btn{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  position: relative;
  opacity: .7;
  transition: .3s;
  &:hover{
    opacity: 1;
  }

  button{
    position: absolute;
    inset: 0;
    z-index: 5;
  }
}

</style>