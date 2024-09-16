<script setup lang="ts">
import {useNotificationStore} from "@/stores/notifications";

const store = useNotificationStore();
</script>

<template>
  <div v-if="store.notifications.length" class="notification-container">
      <div v-for="notification in store.notifications" :key="notification.id" :class="['notification', notification.type]">
        {{ notification.message }}
        <v-btn
            variant="plain"
            @click="store.removeNotification(notification.id)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
  </div>
</template>


<style scoped>
.notification-container {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 1rem;
  z-index: 9999;
}
.notification {
  border: 1px solid currentColor;
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
  background-color: #e6f4ea;
}

.notification.error {
  border-color: #f44336;
  color: #f44336;
  background-color: #fdecea;
}

.notification.warning {
  border-color: orange;
  color: orange;
  background-color: #fff4e5;
}

.notification.info {
  border-color: blue;
  color: blue;
  background-color: #e8f0fe;
}
</style>
