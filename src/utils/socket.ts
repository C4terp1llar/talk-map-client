import { io } from "socket.io-client";
import {checkTokenValidity, refreshToken} from "@/stores/sync";

const connectSocket = async () => {
    const tokenIsValid = await checkTokenValidity();
    let token = localStorage.getItem('access_token');

    if (!tokenIsValid && token) {
        token = await refreshToken();
    }

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

    return socket;
};

export default connectSocket;
