<script setup lang="ts">
import MainAside from "@/components/common/mainAside.vue";
import MainHeader from "@/components/common/mainHeader.vue";
import {onBeforeMount, onMounted, onUnmounted} from "vue";
import {useUserStore} from "@/stores/user";
import {useNotificationStore} from "@/stores/notifications";
import {useWsStore} from "@/stores/wsStore";

const wsStore = useWsStore()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

onBeforeMount(async () => {
  await userStore.getMainUserInfo()

  if (userStore.error) {
    notificationStore.addNotification('error', userStore.error, 3000)
  }
})

onMounted(async () => {
  await wsStore.connectSocket();
})

onUnmounted(() => {
  wsStore.disconnectSocket();
})
</script>

<template>
  <div class="wrapper">
    <aside class="aside">
      <main-aside/>
    </aside>
    <header class="header">
      <main-header/>
    </header>
    <main class="main">
      <router-view/>
    </main>
  </div>
</template>

<style scoped>
.aside {
  grid-row: span 2;
  grid-column: span 1;
}

.header {
  position: sticky;
  top: 0;
}

.main {
  border-radius: 15px;
  margin: 5px;
  padding: 15px;
  box-shadow: 0 1px 10px currentColor;

  @media (max-width: 650px) {
    :not(.communications__wrapper){
      padding: 5px 5px 90px 5px;
      margin: 5px;
    }
    padding: 0 0 80px 0;
    margin: 0 5px 5px 5px;
  }
}

.wrapper {
  padding: 0 10%;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: auto 7fr;
  grid-template-rows: auto 1fr;

  position: relative;

  @media (max-width: 1200px) {
    padding: 0 5%;
  }

  @media (max-width: 768px) {
    padding: 0;
  }

  @media (max-width: 650px) {
    gap: 0;
  }
}
</style>