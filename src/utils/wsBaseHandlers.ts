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

    socket.on("send_friend_request", (payload) => {
        console.log("заявка в друзья", payload);
    });
};
