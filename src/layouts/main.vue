<script setup lang="ts">

import MainAside from "@/components/common/mainAside.vue";
import MainHeader from "@/components/common/mainHeader.vue";
import {onMounted} from "vue";
import {useUserStore} from "@/stores/user";
import {useNotificationStore} from "@/stores/notifications";

const userStore = useUserStore()
const notificationStore = useNotificationStore()

onMounted(async () => {
  await userStore.getMainUserInfo()

  if (userStore.error){
    notificationStore.addNotification('error', userStore.error, 3000)
  }
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
.aside{
  grid-row: span 2;
  grid-column: span 1;
}

.header{
  position: sticky;
  top: 0;
}

.main {
  border-radius: 15px;
  padding: 15px;
  margin: 5px;
  box-shadow: 0 1px 10px currentColor;

  @media (max-width: 650px) {
    padding-bottom: 90px;
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