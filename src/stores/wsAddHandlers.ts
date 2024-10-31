import {defineStore} from "pinia";
import {useExternalUserStore} from "@/stores/externalUser";
import {useFriendsStore} from "@/stores/friends";
import type {FriendRequest} from "@/helpers/interfaces";

export const useWsAddStore = defineStore('wsAdd', () => {

    const externalStore = useExternalUserStore()
    const friendStore = useFriendsStore()

    const receiveFriendReq = (req: FriendRequest) => {
        console.log('заявка в друзья от ', req.sender_id);

        if (friendStore.viewMode === 'incoming' && friendStore.foundRequests){
            friendStore.foundRequests.unshift(req)
        }

        if (externalStore.main?._id !== req.sender_id) return;
        externalStore.isIncoming = true;
    }

    const abortFriendReq = (req: FriendRequest) => {
        console.log('отмена заявки от ', req.sender_id);

        if (friendStore.viewMode === 'incoming' && friendStore.foundRequests){
            friendStore.foundRequests = friendStore.foundRequests.filter(item => item.sender_id !== req.sender_id)
        }

        if (externalStore.main?._id !== req.sender_id) return;
        externalStore.isIncoming = false;
    }

    const declineFriendReq = (id: string) => {
        console.log('отклонение заявки от ', id);

        if (externalStore.main?._id !== id) return;
        externalStore.isOutgoing = false;
    }

    const submitFriendReq = (id: string) => {
        console.log('подтвержение заявки от ', id);

        if (externalStore.main?._id !== id) return;
        externalStore.isOutgoing = false;
        externalStore.isIncoming = false;
        externalStore.isFriendship = true;
    }

    const deleteFriendship = (id: string) => {
        console.log('удаление из друзей от ', id);

        if (externalStore.main?._id !== id) return;
        externalStore.isOutgoing = false;
        externalStore.isIncoming = false;
        externalStore.isFriendship = false;
    }

    return {
        receiveFriendReq,
        abortFriendReq,
        declineFriendReq,
        submitFriendReq,
        deleteFriendship
    }
});


