<script setup lang="ts">
import {useNotificationStore} from "@/stores/notifications";
import {useExternalUserStore} from "@/stores/externalUser";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {onClickOutside} from "@vueuse/core";
import {ref} from "vue";


const emit = defineEmits();

const menuRef = ref<HTMLElement | null>(null);

const externalStore = useExternalUserStore();
const notificationStore = useNotificationStore();

const handleSendReq = async () => {
  if (!externalStore.main?._id) return;

  clickOutside();

  await externalStore.sendFriendRequest(externalStore.main?._id);

  if (externalStore.friendReqError) {
    notificationStore.addNotification('error', externalStore.friendReqError, 3000);
  } else {
    externalStore.isOutgoing = true;
    notificationStore.addNotification('success', 'Заявка успешно отправлена', 5000);
  }
}

const handleCancelReq = async () => {
  if (!externalStore.main?._id) return;

  clickOutside();

  await externalStore.cancelFriendRequest(externalStore.main?._id);

  if (externalStore.friendReqError) {
    notificationStore.addNotification('error', externalStore.friendReqError, 3000);
    return;
  }else {
    externalStore.isOutgoing = false;
    notificationStore.addNotification('success', 'Заявка успешно отменена', 5000);
  }

}

const handleDeclineReq = async () => {
  if (!externalStore.main?._id) return;

  clickOutside();

  await externalStore.declineFriendRequest(externalStore.main?._id);

  if (externalStore.friendReqError) {
    notificationStore.addNotification('error', externalStore.friendReqError, 3000);
  } else {
    externalStore.isIncoming = false;
    notificationStore.addNotification('success', 'Заявка успешно отклонена :(', 5000);
  }
}

const handleSubmitReq = async () => {
  if (!externalStore.main?._id) return;

  clickOutside();

  await externalStore.submitFriendRequest(externalStore.main?._id);

  if (externalStore.friendReqError) {
    notificationStore.addNotification('error', externalStore.friendReqError, 3000);
  } else {
    externalStore.isIncoming = false;
    externalStore.isFriendship = true;
    notificationStore.addNotification('success', 'Теперь вы друзья :)', 5000);
  }
}

const deleteFriend = async () => {
  if (!externalStore.main?._id) return;

  clickOutside();

  await externalStore.deleteFriendship(externalStore.main?._id);

  if (externalStore.friendReqError) {
    notificationStore.addNotification('error', externalStore.friendReqError, 3000);
  } else {
    externalStore.isFriendship = false;
    notificationStore.addNotification('success', 'Больше вы не друзья :(', 5000);
  }
}

const clickOutside = () => {
  emit('close');
};
onClickOutside(menuRef, clickOutside);
</script>

<template>
  <div class="external-actions__menu" ref="menuRef">
    <v-btn
        variant="text"
        class="text-none w-100 justify-content-start"
        v-if="externalStore.isIncoming && !externalStore.isOutgoing"
        @click="handleSubmitReq"
    >
      <v-icon color="green" :size="24" class="mr-2">mdi-account-check-outline</v-icon>
      Принять заявку
    </v-btn>

    <v-btn
        variant="text"
        class="text-none w-100 justify-content-start"
        v-if="externalStore.isIncoming && !externalStore.isOutgoing"
        @click="handleDeclineReq"
    >
      <v-icon color="red" :size="24" class="mr-2">mdi-close-octagon-outline</v-icon>
      Отклонить заявку
    </v-btn>

    <v-btn
        variant="text"
        class="text-none w-100 justify-content-start"
        v-if="!externalStore.isIncoming && externalStore.isOutgoing"
        @click="handleCancelReq"
    >
      <v-icon color="red" :size="24" class="mr-2">mdi-trash-can-outline</v-icon>
      Отменить заявку
    </v-btn>

    <v-btn
        variant="text"
        class="text-none w-100 justify-content-start"
        v-if="!externalStore.isIncoming && !externalStore.isOutgoing && externalStore.isFriendship"
        @click="deleteFriend"
    >
      <v-icon color="red" :size="24" class="mr-2">mdi-account-remove-outline</v-icon>
      Удалить из друзей
    </v-btn>

    <v-btn
        variant="text"
        class="text-none w-100 justify-content-start"
        v-if="!externalStore.isIncoming && !externalStore.isOutgoing && !externalStore.isFriendship"
        @click="handleSendReq"
    >
      <v-icon color="green" :size="24" class="mr-2">mdi-account-plus-outline</v-icon>
      Добавить в друзья
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
.external-actions__menu {
  position: absolute;
  padding: 15px;
  border-radius: 15px;
  box-shadow: 0 1px 10px currentColor;
  background: rgb(var(--v-theme-background));
  right: 0;
  margin-top: 5px;
}
</style>