import {defineStore} from "pinia";
import {useExternalUserStore} from "@/stores/externalUser";
import {useFriendsStore} from "@/stores/friends";
import type {FriendRequest} from "@/helpers/interfaces";
import {ref} from "vue";
import {useUserStore} from "@/stores/user";
import {useRoute} from "vue-router";

export const useWsAddStore = defineStore('wsAdd', () => {

    const externalStore = useExternalUserStore()
    const friendStore = useFriendsStore()
    const userStore = useUserStore();
    const route = useRoute()

    const receiveFriendReq = (req: FriendRequest) => {
        console.log('заявка в друзья от ', req.sender_id);

        if (friendStore.viewMode === 'incoming' && friendStore.foundRequests){
            friendStore.foundRequests.unshift(req)
        }

        if (userStore.foundUsers && userStore.wasGlobalFlag){
            const foundUser = userStore.foundUsers.find(item => item._id === req.sender_id);

            if (foundUser) {
                foundUser.isIncoming = true;
            }
        }

        if (externalStore.main?._id !== req.sender_id) return;
        externalStore.isIncoming = true;
    }

    const abortFriendReq = (req: FriendRequest) => {
        console.log('отмена заявки от ', req.sender_id);

        if (friendStore.viewMode === 'incoming' && friendStore.foundRequests){
            friendStore.foundRequests = friendStore.foundRequests.filter(item => item._id !== req._id)
        }

        if (userStore.foundUsers && userStore.wasGlobalFlag){
            const foundUser = userStore.foundUsers.find(item => item._id === req.sender_id);

            if (foundUser) {
                foundUser.isIncoming = false;
            }
        }

        if (externalStore.main?._id !== req.sender_id) return;
        externalStore.isIncoming = false;
    }

    const declineFriendReq = (req: FriendRequest) => {
        console.log('отклонение заявки от ', req.recipient_id);

        if (friendStore.viewMode === 'outgoing' && friendStore.foundRequests){
            friendStore.foundRequests = friendStore.foundRequests.filter(item => item._id !== req._id)
        }

        if (userStore.foundUsers && userStore.wasGlobalFlag){
            const foundUser = userStore.foundUsers.find(item => item._id === req.recipient_id);

            if (foundUser) {
                foundUser.isOutgoing = false;
            }
        }

        if (externalStore.main?._id !== req.recipient_id) return;
        externalStore.isOutgoing = false;
    }

    const submitFriendReq = async (req: FriendRequest) => {
        console.log('подтвержение заявки от ', req.recipient_id);

        if (friendStore.viewMode === 'outgoing' && friendStore.foundRequests){
            friendStore.foundRequests = friendStore.foundRequests.filter(item => item._id !== req._id)
        }

        if (userStore.foundUsers && userStore.wasGlobalFlag){
            const userIndex = userStore.foundUsers.findIndex(item => item._id === req.recipient_id);

            if (userIndex !== -1) {
                userStore.foundUsers.splice(userIndex, 1);
            }
        }

        if (userStore.foundUsers && userStore.wasGlobalFlag === false && userStore.mainUserInfo){
            let target = req.sender_id === userStore.mainUserInfo._id ? req.recipient_id : req.sender_id;

            if (route.name === 'friends-user'){
                target = req.sender_id
            }

            userStore.foundUsers.unshift(...await friendStore.getOneUser(target, false))
        }


        if (externalStore.main?._id !== req.recipient_id) return;
        externalStore.isOutgoing = false;
        externalStore.isIncoming = false;
        externalStore.isFriendship = true;
    }

    const deleteFriendship = (id: string) => {
        console.log('удаление из друзей от ', id);

        if (userStore.foundUsers && userStore.wasGlobalFlag === false){

            let searchID
            if (route.name === 'friends-user' && userStore.mainUserInfo){
                searchID = userStore.mainUserInfo._id
            }else{
                searchID = id
            }

            const userIndex = userStore.foundUsers.findIndex(item => item._id === searchID);

            if (userIndex !== -1) {
                userStore.foundUsers.splice(userIndex, 1);
            }
        }

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


