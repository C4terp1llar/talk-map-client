import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ShortMutualUserFriend } from "@/helpers/interfaces";

interface Notification {
    id: number;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    timeout: number;
}

interface FrNotification {
    id: number;
    type: 'receive' | 'abort' | 'decline' | 'submit' | 'delete';
    message: string;
    timeout: number;
    detail: ShortMutualUserFriend;
}

export const useNotificationStore = defineStore('notification', () => {

    const notifications = ref<Notification[]>([]);
    const notificationsFr = ref<FrNotification[]>([]);

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

    const addFrNotification = (payload: FrNotification) => {

        notificationsFr.value.push(payload);

        setTimeout(() => {
            removeNotification(payload.id, 'Fr');
        }, payload.timeout);
    };

    const removeNotification = (id: number, mode: '' | 'Fr' = '') => {
        if (mode === 'Fr') {
            notificationsFr.value = notificationsFr.value.filter(n => n.id !== id);
        } else {
            notifications.value = notifications.value.filter(n => n.id !== id);
        }
    };

    return {
        notifications,
        notificationsFr,
        addNotification,
        addFrNotification,
        removeNotification
    };
});
