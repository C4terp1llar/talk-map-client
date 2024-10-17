import { defineStore } from "pinia";
import { ref } from "vue";
import { io, Socket } from "socket.io-client";
import { checkTokenValidity, refreshToken } from "@/stores/sync";

export const useWsStore = defineStore('ws', () => {

    const userSocket = ref<Socket | null>(null);

    const connectSocket = async () => {
        let token = localStorage.getItem('access_token');

        if (!token) return

        const tokenIsValid = await checkTokenValidity();

        if (!tokenIsValid && token) {
            token = await refreshToken();
        }

        // Закрытие предыдущего соединения, если оно существует
        if (userSocket.value) {
            userSocket.value.disconnect();
        }

        // Инициализация нового соединения
        const socket = io(import.meta.env.VITE_API_WS_URL, {
            auth: {
                token: `Bearer ${token}`,
            },
            withCredentials: true
        });

        socket.on("connect", () => {
            console.log("ws подключен");
        });

        socket.on("connect_error", (error) => {
            console.error("Ошибка соединения:", error.message);
        });

        socket.on("disconnect", (reason) => {
            console.log("ws отключен");
        });

        userSocket.value = socket;
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
