import {defineStore} from "pinia";
import {useExternalUserStore} from "@/stores/externalUser";

export const useWsAddStore = defineStore('wsAdd', () => {

    const externalStore = useExternalUserStore()

    const receiveFriendReq = (id: string) => {
        console.log('заявка в друзья от ', id);

        if (externalStore.main?._id !== id) return;
        externalStore.isIncoming = true;
    }

    const abortFriendReq = (id: string) => {
        console.log('отмена заявки от ', id);

        if (externalStore.main?._id !== id) return;
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


