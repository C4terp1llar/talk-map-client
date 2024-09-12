<script setup lang="ts">
import {useNotificationStore} from "@/stores/notifications";

const store = useNotificationStore();
</script>

<template>
  <div v-if="store.notifications.length" class="notification-container">
  <transition-group mode="out-in">
      <div v-for="notification in store.notifications" :key="notification.id" :class="['notification', notification.type]">
        {{ notification.message }}
        <button @click="store.removeNotification(notification.id)">×</button>
      </div>
    </transition-group>
  </div>
</template>


<style scoped>
.notification-container {
  position: fixed;
  top: 0;
  right: 0;
  padding: 1rem;
  z-index: 9999;
}
.notification {
  color: currentColor;
  border: 1px solid currentColor;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.notification.success {
  border-color: #4caf50;
  color: #4caf50;
}
.notification.error {
  border-color: #f44336;
  color: #f44336;
}
.notification.warning {
  border-color: orange;
  color: orange;
}
.notification.info {
  border-color: blue;
  color: blue;
}
.notification button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.2rem;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
