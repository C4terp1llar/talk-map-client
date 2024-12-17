<script setup lang="ts">
import PhotosList from "@/components/photos/photosList.vue";
import {useRoute, useRouter} from "vue-router";
import {useExternalUserStore} from "@/stores/externalUser";
import {useNotificationStore} from "@/stores/notifications";
import {onBeforeMount, onMounted, onUnmounted, ref, watch} from "vue";
import SearchFriendNotFound from "@/components/friends/searchFriendNotFound.vue";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import ExternalPhotoInfo from "@/components/photos/externalPhotoInfo.vue";

const route = useRoute()
const router = useRouter()

const externalUserStore = useExternalUserStore();
const notificationStore = useNotificationStore();

onUnmounted(() => externalUserStore.clearMain())

onMounted(async () => {
  await beforeLoad()
})

// watch(
//     () => route.params.uid,
//     async (newId) => {
//       if (newId) {
//         await beforeLoad()
//       }
//     }
// );

const beforeLoad = async () => {
  const userId = Array.isArray(route.params.uid) ? route.params.id[0] : route.params.uid;

  const match = await externalUserStore.isUserExist(userId);

  if (match) {
    await router.push({name: 'photos'});
  } else if (!match && externalUserStore.existFlag) {
    await externalUserStore.getExternalMainUserInfo(userId)
  }

  if (externalUserStore.error) {
    notificationStore.addNotification('error', externalUserStore.error, 3000)
  }
}
</script>

<template>
  <div class="photos-page__wrapper"  v-if="externalUserStore.existFlag || externalUserStore.pending">
    <lazy-placeholder-loader v-if="externalUserStore.pending"/>

    <external-photo-info v-if="!externalUserStore.pending && externalUserStore.existFlag" />
    <photos-list v-if="!externalUserStore.pending && externalUserStore.existFlag" mode="external" :uid="Array.isArray(route.params.uid) ? route.params.id[0] : route.params.uid"/>
  </div>

  <div class="friends-user-not-found" v-if="!externalUserStore.existFlag && !externalUserStore.pending">
    <search-friend-not-found/>
  </div>
</template>

<style scoped lang="scss">

.photos-page__wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;
}

.friends-user-not-found {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>