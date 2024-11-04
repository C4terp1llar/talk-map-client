<script setup lang="ts">
import type {FriendRequest} from "@/helpers/interfaces";
import {useExternalUserStore} from "@/stores/externalUser";
import {useNotificationStore} from "@/stores/notifications";
import CircularLoader from "@/components/common/circularLoader.vue";
import {useFriendsStore} from "@/stores/friends";
import {ref} from "vue";

interface Props {
  mode: 'incoming' | 'outgoing',
  req: {
    recipient: string;
    sender: string;
  }
}

const props = defineProps<Props>()

const externalStore = useExternalUserStore();
const notificationStore = useNotificationStore();
const friendStore = useFriendsStore();

const pending = ref<string | null>(null);

const handleCancelReq = async () => {
  pending.value = props.req.recipient;

  await externalStore.cancelFriendRequest(props.req.recipient);

  if (externalStore.friendReqError) {
    notificationStore.addNotification('error', externalStore.friendReqError, 3000);
  } else {
    if(!friendStore.foundRequests) return;

    friendStore.foundRequests = friendStore.foundRequests.filter(item => item.recipient_id !== props.req.recipient);
    notificationStore.addNotification('success', 'Заявка успешно отменена', 5000);
  }
 pending.value = null;
}

const handleDeclineReq = async () => {
  pending.value = props.req.sender;

  await externalStore.declineFriendRequest(props.req.sender);

  if (externalStore.friendReqError) {
    notificationStore.addNotification('error', externalStore.friendReqError, 3000);
  } else {
    if(!friendStore.foundRequests) return;

    friendStore.foundRequests = friendStore.foundRequests.filter(item => item.recipient_id !== props.req.recipient);
    notificationStore.addNotification('success', 'Заявка успешно отклонена :(', 5000);
  }
  pending.value = null;
}

const handleSubmitReq = async () => {
  pending.value = props.req.recipient;

  await externalStore.submitFriendRequest(props.req.sender);

  if (externalStore.friendReqError) {
    notificationStore.addNotification('error', externalStore.friendReqError, 3000);
  } else {
    if(!friendStore.foundRequests) return;

    friendStore.foundRequests = friendStore.foundRequests.filter(item => item.recipient_id !== props.req.recipient);
    notificationStore.addNotification('success', 'Теперь вы друзья :)', 5000);
  }
  pending.value = null;
}
</script>

<template>
  <div class="friends-reqs-list-item__actions_menu" v-if="props.mode === 'incoming'">
    <button :disabled="externalStore.friendReqPending" @click="handleSubmitReq">
      <circular-loader :size="24" v-if="pending === props.req.recipient" />
      <v-icon color="green" v-else>mdi-account-check-outline</v-icon>
    </button>
    <button :disabled="externalStore.friendReqPending" @click="handleDeclineReq">
      <circular-loader :size="24" v-if="pending === props.req.sender" />
      <v-icon color="red" :size="24" v-else>mdi-close-octagon-outline</v-icon>
    </button>
  </div>
  <div class="friends-reqs-list-item__actions_menu" v-else>
    <button :disabled="externalStore.friendReqPending"  @click="handleCancelReq">
      <circular-loader :size="24" v-if="pending === props.req.recipient" />
      <v-icon color="red" :size="24" v-else>mdi-trash-can-outline</v-icon>
    </button>
  </div>
</template>

<style scoped lang="scss">
.friends-reqs-list-item__actions_menu {
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  gap: 10px;
  background: rgb(var(--v-theme-background));

  button {
    opacity: 1;
    transition: .3s;

    &:hover {
      opacity: .7;
    }
  }
}
</style>