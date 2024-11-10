<script setup lang="ts">
import {useFriendsStore} from "@/stores/friends";
import {useNotificationStore} from "@/stores/notifications";
import {onMounted, onUnmounted, ref} from "vue";
import type {ShortMutualUserFriend} from "@/helpers/interfaces";
import {onClickOutside} from "@vueuse/core";
import {useImagePopupStore} from "@/stores/imagePopup";
import FriendsMutualList from "@/components/friends/friendsMutualList.vue";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import MutalItemSkeleton from "@/components/skeletons/mutalItemSkeleton.vue";

interface Props {
  id: string;
}

const props = defineProps<Props>();

const friendsStore = useFriendsStore();
const popupStore = useImagePopupStore();
const notificationsStore = useNotificationStore();

onMounted(async () => {
  popupStore.lockScroll();

  await friendsStore.getMutualFriends('load', props.id)

  if (friendsStore.mutualError) {
    notificationsStore.addNotification('error', friendsStore.mutualError, 3000);
  }
})

onUnmounted(() => {
  popupStore.unlockScroll();
  friendsStore.mutualClear();
})


const emit = defineEmits(['close']);

const mutualFriendsRef = ref<HTMLElement | null>(null);

const clickOutside = () => {
  emit('close');
};
onClickOutside(mutualFriendsRef, clickOutside);
</script>

<template>
    <div class="mutual-friends-popup__wrapper">

      <div class="mutual-friends-popup__content styled-scroll" ref="mutualFriendsRef">
        <friends-mutual-list :id="props.id"/>

        <button @click="clickOutside">
          <v-icon>mdi-close</v-icon>
        </button>
      </div>

    </div>
</template>

<style scoped lang="scss">
.mutual-friends-popup__wrapper {
  position: fixed;
  inset: 0;
  z-index: 10003;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);

  .mutual-friends-popup__content {
    box-shadow: 0 1px 10px currentColor;
    background: rgb(var(--v-theme-background));
    border-radius: 15px;
    padding: 15px;
    margin: 5px;
    position: relative;
    display: flex;

    overflow-y: auto;

    button {
      position: absolute;
      right: 5px;
      top: 5px;
      opacity: .8;
      transition: .3s;
      padding: 5px;

      &:hover {
        opacity: 1;
      }
    }

    @media screen and (max-width: 650px) {
      width: 100%;
      height: 100%;
      padding-top: 30px;
    }
  }
}
</style>