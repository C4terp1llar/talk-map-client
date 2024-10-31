<script setup lang="ts">
import { ref, computed } from "vue";
import { useNotificationStore } from "@/stores/notifications";
import { useExternalUserStore } from "@/stores/externalUser";
import { onClickOutside } from "@vueuse/core";

interface Action {
  label: string,
  icon: string,
  color: string,
  handler: Function,
}

const emit = defineEmits();
const menuRef = ref<HTMLElement | null>(null);
const externalStore = useExternalUserStore();
const notificationStore = useNotificationStore();

const actions = computed(() => {
  const commonAction = {
    label: 'Добавить в друзья',
    icon: 'mdi-account-plus-outline',
    color: 'green',
    handler: handleSendReq,
  };

  if (externalStore.isIncoming && !externalStore.isOutgoing) {
    return [
      {
        label: 'Принять заявку',
        icon: 'mdi-account-check-outline',
        color: 'green',
        handler: handleSubmitReq,
      },
      {
        label: 'Отклонить заявку',
        icon: 'mdi-close-octagon-outline',
        color: 'red',
        handler: handleDeclineReq,
      },
    ];
  }

  if (!externalStore.isIncoming && externalStore.isOutgoing) {
    return [
      {
        label: 'Отменить заявку',
        icon: 'mdi-trash-can-outline',
        color: 'red',
        handler: handleCancelReq,
      },
    ];
  }

  if (!externalStore.isIncoming && !externalStore.isOutgoing && externalStore.isFriendship) {
    return [
      {
        label: 'Удалить из друзей',
        icon: 'mdi-account-remove-outline',
        color: 'red',
        handler: deleteFriend,
      },
    ];
  }

  return [commonAction];
});

const handleAction = async (action: Action) => {
  if (!externalStore.main?._id) return;

  clickOutside();

  await action.handler();
}

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

const clickOutside = () => emit('close');
onClickOutside(menuRef, clickOutside);
</script>

<template>
  <div class="external-actions__menu" ref="menuRef">
    <v-btn
        v-for="action in actions"
        :key="action.label"
        variant="text"
        class="text-none w-100 justify-content-start"
        @click="handleAction(action)"
    >
      <v-icon :color="action.color" :size="24" class="mr-2">{{ action.icon }}</v-icon>
      {{ action.label }}
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