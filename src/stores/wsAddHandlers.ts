import {defineStore} from "pinia";
import {useExternalUserStore} from "@/stores/externalUser";
import {useFriendsStore} from "@/stores/friends";
import type {FriendRequest} from "@/helpers/interfaces";
import {ref} from "vue";
import {useUserStore} from "@/stores/user";
import {useRoute} from "vue-router";
import {useSoundsStore} from "@/stores/sounds";
import {useNotificationStore} from "@/stores/notifications";

export const useWsAddStore = defineStore('wsAdd', () => {

    const externalStore = useExternalUserStore()
    const friendStore = useFriendsStore()
    const userStore = useUserStore();
    const soundStore = useSoundsStore();
    const notificationStore = useNotificationStore();

    const route = useRoute();


    const receiveFriendReq = async (req: FriendRequest) => {
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

        soundStore.addSound({soundType: 'default', soundCaller: 'receiveFriendReq'})

        notifyWithoutPreload('receive', req);

        await externalStore.getReqsAmount();

        if (externalStore.main?._id !== req.sender_id) return;
        externalStore.isIncoming = true;
    }

    const abortFriendReq = async (req: FriendRequest) => {
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

        soundStore.addSound({soundType: 'default', soundCaller: 'abortFriendReq'})

        notifyWithoutPreload('abort', req)

        await externalStore.getReqsAmount();

        if (externalStore.main?._id !== req.sender_id) return;
        externalStore.isIncoming = false;
    }

    const declineFriendReq = async (req: FriendRequest) => {
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

        soundStore.addSound({soundType: 'default', soundCaller: 'declineFriendReq'})

        await notifyWithPreload('decline', '', {recipient_id: req.recipient_id, sender_id: req.sender_id})

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

        soundStore.addSound({soundType: 'default', soundCaller: 'submitFriendReq'})

        await notifyWithPreload('submit', '', {recipient_id: req.recipient_id, sender_id: req.sender_id})

        if (externalStore.main?._id !== req.recipient_id) return;
        externalStore.isOutgoing = false;
        externalStore.isIncoming = false;
        externalStore.isFriendship = true;
    }

    const deleteFriendship = async (id: string) => {
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

        soundStore.addSound({soundType: 'default', soundCaller: 'deleteFriendship'})

        await notifyWithPreload('delete', id)

        if (externalStore.main?._id !== id) return;
        externalStore.isOutgoing = false;
        externalStore.isIncoming = false;
        externalStore.isFriendship = false;
    }

    const notifyWithPreload = async (type: 'submit' | 'decline' | 'delete', uid: string, req?: {recipient_id: string, sender_id: string}) => {
        if (userStore.mainUserInfo && (req || uid)){

            let target = uid;

            if (req){
                target = req.sender_id === userStore.mainUserInfo._id ? req.recipient_id : req.sender_id;
            }

            const user = await friendStore.getOneUser(target, false);

            notificationStore.addFrNotification({
                id: Date.now() + Math.random(),
                type: type,
                message: type,
                timeout: 15000,
                detail: {
                    ...user[0]
                }
            })
        }
    }

    const notifyWithoutPreload = (type: 'receive' | 'abort', req: FriendRequest) => {
        notificationStore.addFrNotification({
            id: Date.now() + Math.random(),
            type: type,
            message: type,
            timeout: 15000,
            detail: {
                _id: req.sender_id,
                nickname: req.userInfo.nickname,
                nickname_color: req.userInfo.nickname_color,
                avatar: {
                    asset_url: req.avatar.asset_url
                },
            }
        })
    }

    return {
        receiveFriendReq,
        abortFriendReq,
        declineFriendReq,
        submitFriendReq,
        deleteFriendship
    }
});


