<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/stores/user";
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";
import {useNotificationStore} from "@/stores/notifications";
import {computed, onMounted, onUnmounted, ref} from "vue";
import type {ShortMutualUserFriend} from "@/helpers/interfaces";
import {useFriendsStore} from "@/stores/friends";
import {useExternalUserStore} from "@/stores/externalUser";
import FriendsMutual from "@/components/friends/friendsMutual.vue";
import TextDivider from "@/components/common/textDivider.vue";
import FriendsMutualItem from "@/components/friends/friendsMutualItem.vue";
import ShortHomeBlockSkeleton from "@/components/skeletons/shortHomeBlockSkeleton.vue";
import FriendsMutualFull from "@/components/friends/friendsMutualFull.vue";

interface Props {
  withoutPreload?: boolean,
}

const props = defineProps<Props>()

const friendStore = useFriendsStore();
const notificationsStore = useNotificationStore();
const externalStore = useExternalUserStore()

const route = useRoute();
const showFullMutual = ref<boolean>(false);

const handleClose = () => {
  setTimeout(() => {
    showFullMutual.value = false;
  }, 0)
}

onUnmounted(() => {
  friendStore.foundMutual = null;
})

onMounted(async () => {
  if (!externalStore.existFlag || !route.params.id || typeof route.params.id !== "string" || props.withoutPreload) return;

  await friendStore.getMutualFriends('load', route.params.id)

  if (friendStore.mutualError) {
    notificationsStore.addNotification('error', friendStore.mutualError, 3000)
  }
})

const shortMutual = computed((): ShortMutualUserFriend[] | void => {
  if (!friendStore.foundMutual) return;

  return friendStore.foundMutual.slice(0, 3)
})
</script>

<template>
  <div class="external-mutual-friends__wrapper" v-if="!friendStore.mutualPending && !externalStore.pending">
    <text-divider text="Общие друзья"/>

    <div class="external-mutual-friends__items mt-2" v-if="shortMutual && shortMutual.length">
      <friends-mutual-item v-for="friend in shortMutual" :mutual="friend" :is-short="true"/>
    </div>
    <div class="d-flex flex-column align-items-center mt-2 __no-friends" v-if="!shortMutual || !shortMutual.length">
      <h6 class="text-center text-no-wrap">Общих друзей нет 🧑‍🤝‍🧑</h6>
    </div>

    <button class="load-more-btn__link mt-2 m-auto" v-if="friendStore.foundMutual && friendStore.foundMutual.length > 3" @click="showFullMutual = true">
      <v-icon>mdi-dots-horizontal</v-icon>
    </button>

  </div>
  <short-home-block-skeleton :is-short="true" v-if="friendStore.mutualPending || externalStore.pending"/>
  <friends-mutual-full @close="handleClose" v-if="showFullMutual"
                       :id="route.params.id && typeof route.params.id === 'string' ? route.params.id : ''"
                       mode="mutual"/>
</template>

<style scoped lang="scss">
.__no-friends {
  gap: 5px;
}

.external-mutual-friends__wrapper {
  height:  fit-content;
  width: 100%;
  box-shadow: 0 1px 10px currentColor;
  border-radius: 15px;
  padding: 10px;
  background: rgb(var(--v-theme-background));

  @media screen and (max-width: 1370px){
    width: 100%;
  }


  .external-mutual-friends__items {
    display: flex;
    gap: 3px;
    justify-content: center;
    flex-wrap: wrap;
    width: fit-content;
    margin: auto;

  }
}
</style>