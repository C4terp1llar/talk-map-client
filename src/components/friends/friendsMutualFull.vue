<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {onClickOutside} from "@vueuse/core";
import {useImagePopupStore} from "@/stores/imagePopup";
import FriendsMutualList from "@/components/friends/friendsMutualList.vue";
import {useFullPopupData} from "@/stores/fullPopupData";

interface Props {
  id: string;
  mode: 'friends' | 'mutual'
}

const props = defineProps<Props>();

const popupStore = useImagePopupStore();

const fullPopup = useFullPopupData();

onMounted( () => {
  popupStore.lockScroll();
})

onUnmounted(() => {
  popupStore.unlockScroll();
  fullPopup.fullMutualClear();
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

        <friends-mutual-list @close="clickOutside" :mode="props.mode" :id="props.id"/>

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
    position: relative;
    margin: 5px;

    overflow-y: auto;

    width: 700px;
    max-height: 60vh;

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
      max-height: unset;
      height: calc(100% - 10px);
      padding-top: 30px;
    }
  }
}
</style>