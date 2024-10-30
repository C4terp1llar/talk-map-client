import type {Socket} from "socket.io-client";

export const attachBaseWsHandlers = (socket: Socket) => {
    socket.on("connect", () => {
        console.log("ws подключен");
    });

    socket.on("connect_error", (error) => {
        console.error("Ошибка соединения:", error.message);
    });

    socket.on("disconnect", (reason) => {
        console.log("ws отключен");
    });
};
