<script setup lang="ts">
import type {FriendRequest} from "@/helpers/interfaces";
import {useExternalUserStore} from "@/stores/externalUser";
import {useNotificationStore} from "@/stores/notifications";
import CircularLoader from "@/components/common/circularLoader.vue";
import {useFriendsStore} from "@/stores/friends";
import {ref} from "vue";
import {useUserStore} from "@/stores/user";

interface Props {
  mode: 'incoming' | 'outgoing' | 'friends' | '',
  data_mode: 'user' | 'req',
  req: {
    recipient: string;
    sender: string;
  }
}

const props = defineProps<Props>()

const userStore = useUserStore()
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

    if (friendStore.foundRequests && props.data_mode === 'req') {
      friendStore.foundRequests = friendStore.foundRequests.filter(item => item.recipient_id !== props.req.recipient);
    }

    if(userStore.foundUsers && props.data_mode === 'user'){
      const user = userStore.foundUsers.find(item => item._id === props.req.recipient)
      if(user){
        user.isOutgoing = false;
      }
    }

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

    if (friendStore.foundRequests && props.data_mode === 'req'){
      friendStore.foundRequests = friendStore.foundRequests.filter(item => item.sender_id !== props.req.sender);
    }

    if(userStore.foundUsers && props.data_mode === 'user'){
      const user = userStore.foundUsers.find(item => item._id === props.req.sender)
      if(user){
        user.isIncoming = false;
      }
    }

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

    if (friendStore.foundRequests && props.data_mode === 'req') {
      friendStore.foundRequests = friendStore.foundRequests.filter(item => item.sender_id !== props.req.sender);
    }

    if(userStore.foundUsers && props.data_mode === 'user'){
      const userIndex = userStore.foundUsers.findIndex(item => item._id === props.req.sender);

      if (userIndex !== -1) {
        userStore.foundUsers.splice(userIndex, 1);
      }
    }

    notificationStore.addNotification('success', 'Теперь вы друзья :)', 5000);
  }
  pending.value = null;
}

const deleteFriend = async () => {
  pending.value = props.req.recipient;

  await externalStore.deleteFriendship(props.req.recipient);

  if (externalStore.friendReqError) {
    notificationStore.addNotification('error', externalStore.friendReqError, 3000);
  } else {

    if(userStore.foundUsers && props.data_mode === 'user'){
      const userIndex = userStore.foundUsers.findIndex(item => item._id === props.req.recipient);

      if (userIndex !== -1) {
        userStore.foundUsers.splice(userIndex, 1);
      }
    }

    notificationStore.addNotification('success', 'Больше вы не друзья :(', 5000);
  }

  pending.value = null;
}

</script>

<template>

    <div class="friends-reqs-list-item__actions_menu" v-if="props.mode === 'incoming'">
      <button :disabled="externalStore.friendReqPending || userStore.findUserPending || userStore.loadMoreUsersFlag" @click="handleSubmitReq">
        <circular-loader :size="24" v-if="pending === props.req.recipient"/>
        <v-icon color="green" v-else>mdi-account-check-outline</v-icon>
      </button>
      <button :disabled="externalStore.friendReqPending || userStore.findUserPending || userStore.loadMoreUsersFlag" @click="handleDeclineReq">
        <circular-loader :size="24" v-if="pending === props.req.sender"/>
        <v-icon color="red" :size="24" v-else>mdi-close-octagon-outline</v-icon>
      </button>
    </div>
    <div class="friends-reqs-list-item__actions_menu" v-else-if="props.mode === 'outgoing'">
      <button :disabled="externalStore.friendReqPending || userStore.findUserPending || userStore.loadMoreUsersFlag" @click="handleCancelReq">
        <circular-loader :size="24" v-if="pending === props.req.recipient"/>
        <v-icon color="red" :size="24" v-else>mdi-trash-can-outline</v-icon>
      </button>
    </div>
    <div class="friends-reqs-list-item__actions_menu" v-else-if="props.mode === 'friends'">
      <button :disabled="externalStore.friendReqPending || userStore.findUserPending || userStore.loadMoreUsersFlag" @click="deleteFriend">
        <circular-loader :size="24" v-if="pending === props.req.recipient"/>
        <v-icon color="red" :size="24" v-else>mdi-account-remove-outline</v-icon>
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