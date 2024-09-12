import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Notification {
    id: number;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    timeout: number;
}

export const useNotificationStore = defineStore('notification', () => {

    const notifications = ref<Notification[]>([]);

    const addNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string, timeout = 5000) => {

        const id = Date.now() + Math.random();

        notifications.value.push({
            id,
            type,
            message,
            timeout,
        });

        setTimeout(() => {
            removeNotification(id);
        }, timeout);
    };

    const removeNotification = (id: number) => {
        notifications.value = notifications.value.filter(n => n.id !== id);
    };

    return { notifications, addNotification, removeNotification };
});
