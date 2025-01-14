<script setup lang="ts">
import {computed, onMounted, onUnmounted} from "vue";
import {useSecurityStore} from "@/stores/security";
import {useNotificationStore} from "@/stores/notifications";
import SessionItemSkeleton from "@/components/skeletons/sessionItemSkeleton.vue";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";
import SessionItem from "@/components/settings/security/sessionItem.vue";
import TextDivider from "@/components/common/textDivider.vue";
import NotFoundTemplate from "@/components/notFoundTemplate.vue";

const secureStore = useSecurityStore()
const notificationStore = useNotificationStore();

const moreFlag = computed(() => {
  return (
      secureStore.sessions &&
      secureStore.sessions.length === secureStore.perPage * secureStore.currentPage &&
      secureStore.hasMore &&
      !secureStore.loadPending &&
      !secureStore.loaMorePending
  )
})

onMounted(async () => {
  await uploadData('l')
})

onUnmounted(() => secureStore.sessionsClear())

const uploadData = async (mode: 'l' | 'l-more', withoutPending?: boolean) => {
  if (!moreFlag && mode === 'l-more') return

  await secureStore.getActiveSessions(mode, withoutPending)

  if (secureStore.sessionError) {
    notificationStore.addNotification('error', secureStore.sessionError, 3000)
  }
}
</script>

<template>
  <div class="sessions-list__wrapper">
    <session-item-skeleton v-if="secureStore.loadPending" v-for="i in 3" :key="i"/>

    <div class="sessions-list-active__content-wrapper" v-if="!secureStore.loadPending && secureStore.activeSession">
      <text-divider text="Активная сессия"/>
      <session-item :session="secureStore.activeSession" mode="active"/>
    </div>

    <div class="sessions-list__content-wrapper" v-if="!secureStore.loadPending && secureStore.sessions">
      <text-divider text="Сессии"/>

      <not-found-template :icon-size="28" text="Других сессий пока нет" icon="mdi-badge-account-horizontal-outline" icon-color="green" v-if="!secureStore.sessions.length"/>

      <session-item v-else @reload-sessions="uploadData('l', true)" v-for="s in secureStore.sessions" :key="s._id" :session="s"/>

      <v-divider class="mt-2 mb-1"/>

      <div class="controls  mt-1 d-flex justify-content-center">
        <v-btn
            color="green"
            class="text-none"
            variant="text"
            @click="uploadData('l-more')"
            v-if="moreFlag"
        >
          Еще
        </v-btn>
      </div>

      <pagination-dot-loader class="mt-1" v-if="secureStore.loaMorePending"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sessions-list__content-wrapper{
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>