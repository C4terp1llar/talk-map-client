import { defineStore } from "pinia";
import { ref} from "vue";
import type { Ref } from "vue";
import { io, Socket } from "socket.io-client";
import { checkTokenValidity, refreshToken } from "@/stores/sync";
import {attachBaseWsHandlers} from "@/utils/wsBaseHandlers";

type UserSocket = Socket | null;

export const useWsStore = defineStore('ws', () => {
    const userSocket: Ref<UserSocket> = ref(null);

    const connectSocket = async () => {
        let token = localStorage.getItem('access_token');

        if (!token) return;

        const tokenIsValid = await checkTokenValidity();

        if (!tokenIsValid && token) {
            token = await refreshToken();
        }

        // если сокет уже есть
        if (userSocket.value) {
            userSocket.value.disconnect();
        }

        //новый сокет
        const socket: Socket = io(import.meta.env.VITE_API_WS_URL, {
            auth: {
                token: `Bearer ${token}`,
            },
            withCredentials: true,
        });

        userSocket.value = socket;

        attachBaseWsHandlers(userSocket.value)
    };

    const disconnectSocket = () => {
        if (userSocket.value) {
            userSocket.value.disconnect();
            userSocket.value = null;
        }
    };

    return {
        userSocket,
        connectSocket,
        disconnectSocket,
    };
});
