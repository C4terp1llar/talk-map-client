import { defineStore } from "pinia";
import { ref} from "vue";
import type { Ref } from "vue";
import { io, Socket } from "socket.io-client";
import { checkTokenValidity, refreshToken } from "@/stores/sync";
import {attachBaseWsHandlers} from "@/utils/wsBaseHandlers";
import {useWsAddStore} from "@/stores/wsAddHandlers";
import type {FriendRequest, Post} from "@/helpers/interfaces";
import {useWsMdStore} from "@/stores/wsMediaHandlers";

type UserSocket = Socket | null;

export const useWsStore = defineStore('ws', () => {
    const wsAdd = useWsAddStore()
    const wsMd = useWsMdStore()

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

        await attachAddWsHandlers();
        await attachMediaWsHandlers();

        socket.on("tokenError", async () => {
            console.log('токен истек, реконнект')
            await connectSocket()
        });
    };

    const attachAddWsHandlers = async () => {
        if (!userSocket.value) return;

        userSocket.value.on('receive_friend_request', (payload: { wsFriendRequestSnap: FriendRequest }) => {
            wsAdd.receiveFriendReq(payload.wsFriendRequestSnap)
        })

        userSocket.value.on('abort_friend_request', (payload: { wsFriendRequestSnap: FriendRequest }) => {
            wsAdd.abortFriendReq(payload.wsFriendRequestSnap)
        })

        userSocket.value.on('decline_friend_request', (payload: { wsFriendRequestSnap: FriendRequest }) => {
            wsAdd.declineFriendReq(payload.wsFriendRequestSnap)
        })

        userSocket.value.on('submit_friend_request', (payload: { wsFriendRequestSnap: FriendRequest }) => {
            wsAdd.submitFriendReq(payload.wsFriendRequestSnap)
        })

        userSocket.value.on('delete_friendship', (payload) => {
            wsAdd.deleteFriendship(payload.sender_id)
        })
    }

    const attachMediaWsHandlers = async () => {
        if (!userSocket.value) return;

        userSocket.value.on('publish_Photo', (payload: { uid: string, phId: string }) => {
            wsMd.publish_photo(payload)
        })

        userSocket.value.on('publish_Post', (payload: { uid: string, post: Post }) => {
            wsMd.publish_post(payload)
        })

        userSocket.value.on('reload_posts', (payload: { post_id?: string, post_owner: string }) => {
            wsMd.reload_posts(payload)
        })

        userSocket.value.on('publish_many_Photo', (payload: { uid: string}) => {
            wsMd.publish_many_photo(payload)
        })

        userSocket.value.on('react_media', (payload: { entity: 'Photo' | 'Post' | 'Comment',  reactor: string, entity_id: string, wasLike: boolean }) => {
            wsMd.react_media(payload)
        })

        userSocket.value.on('publish_comment', (payload: {entity_id: string, entity_type: 'Photo' | 'Post' | 'Comment', commentator: string}) => {
            wsMd.publish_comment(payload)
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


