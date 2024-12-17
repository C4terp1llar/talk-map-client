import {defineStore} from "pinia";
import {useExternalUserStore} from "@/stores/externalUser";
import {useFriendsStore} from "@/stores/friends";
import type {FriendRequest} from "@/helpers/interfaces";
import {ref} from "vue";
import {useUserStore} from "@/stores/user";
import {useRoute} from "vue-router";
import {useSoundsStore} from "@/stores/sounds";
import {useNotificationStore} from "@/stores/notifications";
import {usePhotoStore} from "@/stores/photo";

export const useWsMdStore = defineStore('wsMd', () => {

    const userStore = useUserStore();
    const notificationStore = useNotificationStore();
    const friendStore = useFriendsStore();
    const phStore = usePhotoStore();
    const soundStore = useSoundsStore();


    const route = useRoute();

    const publish_photo = async (payload: { uid: string, phId: string }) => {
        await notifyWithPreload('publish_Photo', payload.uid, payload.phId)
        soundStore.addSound({soundType: 'default', soundCaller: 'publish_photo'})

        if (route.name === 'photos-user' && route.params.uid === payload.uid) {
            await phStore.getPhotos('load', undefined, payload.uid, true)
        }
    }

    const publish_many_photo = async (payload: { uid: string }) => {
        await notifyWithPreload('publish_many_Photo', payload.uid)
        soundStore.addSound({soundType: 'default', soundCaller: 'publish_many_photo'})

        if (route.name === 'photos-user' && route.params.uid === payload.uid) {
            await phStore.getPhotos('load', undefined, payload.uid, true)
        }
    }

    const react_photo = async (payload: { uid: string, phId: string, wasLike: boolean }) => {
        if (!payload.wasLike){
            await notifyWithPreload('react_Photo', payload.uid, payload.phId)
            soundStore.addSound({soundType: 'default', soundCaller: 'react_photo'})
        }

        if (route.query.r === payload.phId && phStore.currentPhoto) {
            payload.wasLike ? phStore.currentPhoto.likesCount -= 1 : phStore.currentPhoto.likesCount += 1
        }
    }


    const notifyWithPreload = async (type: 'publish_Photo' | 'publish_many_Photo' | 'react_Photo', uid: string, phId?: string) => {
        const user = await friendStore.getOneUser(uid, false);

        notificationStore.addFrNotification({
            id: Date.now() + Math.random(),
            type: type,
            message: type,
            timeout: 15000,
            detail: {
                ...user[0]
            },
            actionType: 'media',
            phId: phId
        })
    }

    return {
        publish_photo,
        publish_many_photo,
        react_photo,
    }
});


