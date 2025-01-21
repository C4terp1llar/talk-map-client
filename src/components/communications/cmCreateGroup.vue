<script setup lang="ts">
import CmCreateGroupCover from "@/components/communications/cmCreateGroupCover.vue";
import {onMounted, onUnmounted, ref} from "vue";
import CmCreateGroupTitle from "@/components/communications/cmCreateGroupTitle.vue";
import FriendsList from "@/components/friends/friendsList.vue";
import CmCreateGroupMembers from "@/components/communications/cmCreateGroupMembers.vue";
import {lockScroll, unlockScroll} from "@/helpers/popup";
import {onClickOutside} from "@vueuse/core";

const emit = defineEmits<{
  (e: 'close'): void
}>()

const newGroupCover = ref<string | ArrayBuffer | null>(null);
const newGroupTitle = ref<string>('');
const newGroupDescription = ref<string>('');
const newGroupMembers = ref<string[]>([]);

onMounted(() => {
  document.documentElement.style.overflow = 'hidden';
  lockScroll();
})

onUnmounted(() => {
  document.documentElement.style.overflow = '';
  unlockScroll()
})

const createGroupRef = ref<HTMLElement | null>(null);
const clickOutside = () => {
  emit('close')
};
onClickOutside(createGroupRef, clickOutside);
</script>

<template>
  <div class="g-create-group__wrapper">
    <div class="create-group-content__wrapper" ref="createGroupRef">
      <h5 class="text-center">Создание группы</h5>
      <cm-create-group-cover @cover-select="img => newGroupCover = img"/>
      <cm-create-group-title @title-select="title => newGroupTitle = title"/>
      <div class="field">
        <label class="inp-default-label">Описание:</label>
        <v-textarea variant="outlined" hide-details rows="3" no-resize counter v-model="newGroupDescription"></v-textarea>
      </div>
      <cm-create-group-members @select-member-update="members => newGroupMembers = members"/>
      <div class="controls">
        <v-btn class="text-none" variant="outlined">Создать</v-btn>
        <v-btn class="text-none" variant="text" color="green">Отмена</v-btn>
      </div>
      <button class="close-btn" @click="clickOutside">
        <v-icon>mdi-close</v-icon>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.controls{
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.close-btn{
  position: absolute;
  right: 5px;
  top: 5px;
  transition: .3s;
  &:hover{
    filter: drop-shadow(0 0 2px currentColor);
  }
}

.g-create-group__wrapper {
  position: fixed;
  inset: 0;
  z-index: 10003;
  width: 100%;
  height: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  overflow-y: scroll;

  .create-group-content__wrapper{
    position: relative;
    width: 50vw;
    @media screen and (max-width: 1250px) {
      width: 60vw;
    }
    @media screen and (max-width: 1000px) {
      width: 70vw;
    }
    @media screen and (max-width: 800px) {
      width: 80vw;
    }
    padding: 10px;
    @media screen and (max-width: 650px) {
      width: calc(100vw - 30px);
      padding: 5px;
    }
    margin: 5px;
    box-shadow: 0 1px 10px currentColor;
    border-radius: 15px;
    background: rgb(var(--v-theme-background));
  }

}
</style>