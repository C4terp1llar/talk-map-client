import { defineStore } from "pinia";
import { ref} from "vue";
import type { Ref } from "vue";
import { io, Socket } from "socket.io-client";
import { checkTokenValidity, refreshToken } from "@/stores/sync";
import {attachBaseWsHandlers} from "@/utils/wsBaseHandlers";
import {useWsAddStore} from "@/stores/wsAddHandlers";
import type {FriendRequest} from "@/helpers/interfaces";

type UserSocket = Socket | null;

export const useWsStore = defineStore('ws', () => {
    const wsAdd = useWsAddStore()

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
        attachAddWsHandlers();

        socket.on("tokenError", async () => {
            console.log('токен истек, реконнект')
            await connectSocket()
        });
    };

    const attachAddWsHandlers = () => {
        if (!userSocket.value) return;

        userSocket.value.on('receive_friend_request', (payload: { wsFriendRequestSnap: FriendRequest }) => {
            wsAdd.receiveFriendReq(payload.wsFriendRequestSnap)
        })

        userSocket.value.on('abort_friend_request', (payload: { wsFriendRequestSnap: FriendRequest }) => {
            wsAdd.abortFriendReq(payload.wsFriendRequestSnap)
        })

        userSocket.value.on('decline_friend_request', (payload) => {
            wsAdd.declineFriendReq(payload.recipient_id)
        })

        userSocket.value.on('submit_friend_request', (payload) => {
            wsAdd.submitFriendReq(payload.recipient_id)
        })

        userSocket.value.on('delete_friendship', (payload) => {
            wsAdd.deleteFriendship(payload.sender_id)
        })
    }

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


