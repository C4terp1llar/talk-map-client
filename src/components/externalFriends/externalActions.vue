<script setup lang="ts">
import {ref} from "vue";
import ExternalActionsMenu from "@/components/externalFriends/externalActionsMenu.vue";
import {useExternalUserStore} from "@/stores/externalUser";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import CircularLoader from "@/components/common/circularLoader.vue";

const externalStore = useExternalUserStore();

const isMenuVisible = ref<boolean>(false);

const handleClose = () => {
  setTimeout(() => {
    isMenuVisible.value = false;
  })
}
</script>

<template>
  <div class="external-actions__wrapper">
    <button class="change-wallpaper" @click="isMenuVisible = true">
      <template v-if="!externalStore.friendReqPending">
        <v-icon v-if="!externalStore.isOutgoing && !externalStore.isIncoming && !externalStore.isFriendship" :size="28">mdi-account-plus-outline</v-icon>
        <v-icon v-if="(externalStore.isOutgoing || externalStore.isIncoming) && !externalStore.isFriendship" color="warning" :size="28">mdi-account-badge-outline</v-icon>
        <v-icon v-if="externalStore.isFriendship" color="green" :size="28">mdi-account-check-outline</v-icon>
      </template>
      <template v-else>
        <circular-loader :size="28" />
      </template>
    </button>


    <div class="external-actions__wrapper-menu">
      <v-scroll-y-transition>
        <external-actions-menu v-if="isMenuVisible" @close="handleClose"/>
      </v-scroll-y-transition>
    </div>

    <skeleton-loader class="external-actions__wrapper-loader" :brightness="0.8" v-if="externalStore.pending"/>
  </div>
</template>

<style scoped lang="scss">
.external-actions__wrapper {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;

  .external-actions__wrapper-loader{
    border-radius: 10px;
  }

  .change-wallpaper {
    border-radius: 10px;
    background: rgb(var(--v-theme-background));
    padding: 5px;
    opacity: .7;
    transition: 0.3s;

    &:hover {
      opacity: 1;
    }
  }
}
</style>