import {defineStore} from "pinia";
import {useExternalUserStore} from "@/stores/externalUser";
import {useFriendsStore} from "@/stores/friends";
import type {FriendRequest} from "@/helpers/interfaces";
import {ref} from "vue";
import {useUserStore} from "@/stores/user";
import {useRoute, useRouter} from "vue-router";
import {useSoundsStore} from "@/stores/sounds";
import {useNotificationStore} from "@/stores/notifications";
import {usePhotoStore} from "@/stores/photo";
import {usePostStore} from "@/stores/post";

export const useWsMdStore = defineStore('wsMd', () => {

    const userStore = useUserStore();
    const notificationStore = useNotificationStore();
    const friendStore = useFriendsStore();
    const phStore = usePhotoStore();
    const postStore = usePostStore();
    const soundStore = useSoundsStore();


    const route = useRoute();
    const router = useRouter();

    const publish_photo = async (payload: { uid: string, phId: string }) => {
        console.log('publish_photo')
        await notifyWithPreload('publish_Photo', payload.uid, payload.phId)
        soundStore.addSound({soundType: 'default', soundCaller: 'publish_photo'})

        if (route.name === 'photos-user' && route.params.uid === payload.uid) {
            await phStore.getPhotos('load', undefined, payload.uid, true)
        }
    }

    const publish_many_photo = async (payload: { uid: string }) => {
        console.log('publish_many_photo')
        await notifyWithPreload('publish_many_Photo', payload.uid)
        soundStore.addSound({soundType: 'default', soundCaller: 'publish_many_photo'})

        if (route.name === 'photos-user' && route.params.uid === payload.uid) {
            await phStore.getPhotos('load', undefined, payload.uid, true)
        }
    }

    const react_media = async (payload: { entity: 'Photo' | 'Post' | 'Comment',  reactor: string, entity_id: string, wasLike: boolean }) => {
        console.log('react_photo')

        if (!payload.wasLike){
            await notifyWithPreload(`react_${payload.entity}`, payload.reactor, payload.entity_id)
            soundStore.addSound({soundType: 'default', soundCaller: 'react_photo'})
        }

        if (payload.entity === 'Photo' && route.query.r === payload.entity_id && phStore.currentPhoto) {
            payload.wasLike ? phStore.currentPhoto.likesCount -= 1 : phStore.currentPhoto.likesCount += 1
        }

        if (payload.entity === 'Post' && postStore.posts) {
            const currentPost = postStore.posts.find(i => i._id === payload.entity_id)
            if (currentPost) {
                payload.wasLike ? currentPost.likes_count -= 1 : currentPost.likes_count += 1
            }


            // const element = document.getElementById(payload.entity_id);
            // if (element) {
            //     const top = element.getBoundingClientRect().top + window.scrollY - 100;
            //     window.scrollTo({ top, behavior: 'smooth' });
            // }
        }
    }

    //pb-post
    //rec-post


    const notifyWithPreload = async (
        type: 'publish_Photo' | 'publish_many_Photo' | 'react_Photo' | 'react_Post' | 'react_Comment', uid: string,
        entity_id?: string
    ) => {
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
            entity_id: entity_id
        })
    }

    return {
        publish_photo,
        publish_many_photo,
        react_media,
    }
});


