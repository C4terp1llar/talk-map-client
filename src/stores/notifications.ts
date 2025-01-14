import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {FrNotification, Notification} from "@/helpers/interfaces";

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
        if (localStorage.getItem('ntf_enable') === 'false') return
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
