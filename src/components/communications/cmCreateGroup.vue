<script setup lang="ts">
import CmCreateGroupCover from "@/components/communications/cmCreateGroupCover.vue";
import {onMounted, onUnmounted, ref} from "vue";
import CmCreateGroupTitle from "@/components/communications/cmCreateGroupTitle.vue";
import FriendsList from "@/components/friends/friendsList.vue";
import CmCreateGroupMembers from "@/components/communications/cmCreateGroupMembers.vue";
import {lockScroll, unlockScroll} from "@/helpers/popup";
import {onClickOutside} from "@vueuse/core";
import {useFriendsStore} from "@/stores/friends";
import type {ShortFriend} from "@/helpers/interfaces";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import {useCmStore} from "@/stores/cmStore";

const emit = defineEmits<{
  (e: 'close'): void
}>()

const frStore = useFriendsStore();
const cmStore = useCmStore();

const newGroupCover = ref<string | ArrayBuffer | null>(null);
const newGroupTitle = ref<string>('');
const newGroupDescription = ref<string>('');
const newGroupMembers = ref<string[]>([]);

const prePending = ref<boolean>(false);
const preFriends = ref<ShortFriend[] | null>(null);

onMounted(async() => {
  document.documentElement.style.overflow = 'hidden';
  lockScroll();
  prePending.value = true
  const {friends} = await frStore.getFriends(1, 10);
  preFriends.value = friends;
  prePending.value = false
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

const membersErrors = ref<string[]>([]);

const handleUpdateMembers = (m: string[]) => {
  newGroupMembers.value = m;
  membersErrors.value = []
}

const handleCreateGroup = async () => {
  if (newGroupMembers.value && newGroupMembers.value.length < 2){
    membersErrors.value.push('Добавьте не менее двух пользователей')
    return
  }
  if (!newGroupTitle.value) return

  emit('close')
  await cmStore.createGroup(newGroupTitle.value, newGroupDescription.value, newGroupMembers.value, newGroupCover.value || '');
}
</script>

<template>
  <div class="g-create-group__wrapper">
    <div class="create-group-content__wrapper" ref="createGroupRef">

      <div class="create-group-content__preload" v-if="prePending">
        <lazy-placeholder-loader/>
      </div>

      <div class="create-group-content" v-if="!prePending && preFriends && preFriends.length >= 2">
        <v-form @submit.prevent="handleCreateGroup">
          <h5 class="text-center">Создание группы</h5>
          <cm-create-group-cover @cover-select="img => newGroupCover = img"/>
          <cm-create-group-title @title-select="title => newGroupTitle = title"/>
          <div class="field">
            <label class="inp-default-label">Описание:</label>
            <v-textarea variant="outlined" hide-details rows="3" no-resize counter v-model="newGroupDescription"></v-textarea>
          </div>
          <cm-create-group-members :errors="membersErrors" @select-member-update="members => handleUpdateMembers(members)"/>
          <div class="controls">
            <v-btn class="text-none" type="submit" variant="outlined">Создать</v-btn>
            <v-btn class="text-none" variant="text" color="green" @click="clickOutside">Отмена</v-btn>
          </div>
        </v-form>
      </div>

      <div class="create-group-content__no-friends" v-if="!preFriends && !prePending">
        <span>Произошла ошибка, попробуйте позже</span>
      </div>

      <div class="create-group-content__no-friends" v-if="!prePending && preFriends && preFriends.length < 2">
        <span v-if="preFriends && preFriends.length < 2">{{preFriends.length ? 'У вас всего 1 друг, для создания группы нужно не меньше двух 🥺' : 'У вас нет друзей, для создания группы нужно не меньше двух 🥺'}}</span>
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
  backdrop-filter: blur(10px);
  overflow-y: scroll;
  display: grid;
  align-items: center;
  justify-content: center;

  .create-group-content__preload, .create-group-content__no-friends{
    height: 50vh;
    display: grid;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

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
    .create-group-content{

    }
  }

}
</style>