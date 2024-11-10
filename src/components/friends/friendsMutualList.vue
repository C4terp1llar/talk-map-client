<script setup lang="ts">
import {useFriendsStore} from "@/stores/friends";
import {useNotificationStore} from "@/stores/notifications";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";
import FriendsMutualItem from "@/components/friends/friendsMutualItem.vue";
import MutalItemSkeleton from "@/components/skeletons/mutalItemSkeleton.vue";

interface Props {
  id: string;
}

const props = defineProps<Props>();

const friendsStore = useFriendsStore();
const notificationsStore = useNotificationStore();

const loadMoreFlag = computed(() => {
  return (
      friendsStore.foundMutual &&
      friendsStore.foundMutual.length === friendsStore.perPage * friendsStore.currentPageMutual &&
      friendsStore.hasMoreMutual
  )
})

const handleUpgradeList = async () => {
  if (!loadMoreFlag.value) return;

  await friendsStore.getMutualFriends('load-more', props.id)

  if (friendsStore.mutualError) {
    notificationsStore.addNotification('error', friendsStore.mutualError, 3000)
  }
}

const mutualFriendsRef = ref<HTMLElement | null>(null);
</script>

<template>
  <div class="mutual-friends-popup__content-list" ref="mutualFriendsRef">


    <div class="mutual-friends-popup__content-list__items">
      <mutal-item-skeleton v-for="i in 5" :key="i" v-if="friendsStore.mutualPending"/>
      <friends-mutual-item v-for="mutual in friendsStore.foundMutual" :mutual="mutual" v-else/>

      <h4
          class="text-center"
          v-if="friendsStore.foundMutual && !friendsStore.foundMutual.length"
      >Общих друзей нет :(</h4>
    </div>

    <v-btn
        color="green"
        class="text-none w-100"
        variant="text"
        @click="handleUpgradeList"
        v-if="loadMoreFlag && !friendsStore.mutualMorePending"
    >
      Еще
    </v-btn>

    <pagination-dot-loader v-if="friendsStore.mutualMorePending"/>
  </div>
</template>

<style scoped lang="scss">
.mutual-friends-popup__content-list {
  position: relative;

  width: 700px;
  max-height: 60vh;

  @media screen and (max-width: 650px) {
    width: 100%;
    height: 100%;
    max-height: unset;
    display: flex;
    flex-direction: column;
    align-items: center;

    .mutual-friends-popup__content-list__items {
      margin: auto auto;
    }
  }

  .mutual-friends-popup__content-list__items {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>