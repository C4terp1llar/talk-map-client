<script setup lang="ts">
import { useNotificationStore } from "@/stores/notifications";


const store = useNotificationStore();

const notificationMap = new Map([
  ['error', 'mdi-alert-octagon-outline'],
  ['warning', 'mdi-alert-outline'],
  ['success', 'mdi-check-circle-outline'],
  ['info', 'mdi-information-variant-circle-outline']
]);

const getIcon = (type: string) => {
  return notificationMap.get(type)
};
</script>

<template>
  <div v-if="store.notifications.length" class="notification-container">
    <div
        v-for="notification in store.notifications"
        :key="notification.id"
        :class="['notification', notification.type]"
    >
      <v-icon class="icon-type">{{ getIcon(notification.type) }}</v-icon>
      <span>{{ notification.message }}</span>
      <v-btn
          class="ml-auto"
          variant="plain"
          icon="mdi-close"
          @click="store.removeNotification(notification.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.notification-container {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 1rem;
  z-index: 10005;

  @media (max-width: 650px) {
    bottom: unset;
    top: 0;
    width: 100%;
  }
}

.icon-type {
  outline: 2px solid currentColor;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 1px 20px currentColor;
  margin-right: 10px;
}

.notification {
  backdrop-filter: blur(15px);
  box-shadow: 0 1px 10px currentColor;
  border: 2px solid currentColor;
  border-radius: 15px;
  padding: 1rem;
  margin-bottom: 15px;
  display: flex;
  gap: 5px;
  align-items: center;
}

.notification.success {
  border-color: #4caf50;
  color: #4caf50;
  background: linear-gradient(180deg, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0.1) 100%);
}

.notification.error {
  border-color: #f44336;
  color: #f44336;
  background: linear-gradient(180deg, rgba(244, 67, 54, 0.3) 0%, rgba(244, 67, 54, 0.1) 100%);
}

.notification.warning {
  border-color: orange;
  color: orange;
  background: linear-gradient(180deg, rgba(255, 165, 0, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%);
}

.notification.info {
  border-color: currentColor;
  color: currentColor;
  background: linear-gradient(180deg, rgba(33, 150, 243, 0.3) 0%, rgba(33, 150, 243, 0.1) 100%);
}
</style>
