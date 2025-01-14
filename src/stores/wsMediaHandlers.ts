import {defineStore} from "pinia";
import {useExternalUserStore} from "@/stores/externalUser";
import {useFriendsStore} from "@/stores/friends";
import type {FriendRequest, Post} from "@/helpers/interfaces";
import {ref} from "vue";
import {useUserStore} from "@/stores/user";
import {useRoute, useRouter} from "vue-router";
import {useSoundsStore} from "@/stores/sounds";
import {useNotificationStore} from "@/stores/notifications";
import {usePhotoStore} from "@/stores/photo";
import {usePostStore} from "@/stores/post";
import {useSecurityStore} from "@/stores/security";
import {decodeJWT} from "@/helpers/decodeJwt";
import {useAuthStore} from "@/stores/auth";

export const useWsMdStore = defineStore('wsMd', () => {

    const userStore = useUserStore();
    const notificationStore = useNotificationStore();
    const friendStore = useFriendsStore();
    const phStore = usePhotoStore();
    const postStore = usePostStore();
    const soundStore = useSoundsStore();
    const secureStore = useSecurityStore()
    const authStore = useAuthStore();

    const route = useRoute();
    const router = useRouter();

    const reload_sessions = async () => {
        if (route.name === 'settings' && route.query.tab === 'security'){
            await secureStore.getActiveSessions('l', true)
        }
    }

    const session_close = async (payload: {id: string, device_info: string}) => {
        const token = localStorage.getItem('access_token')
        if (token){
            const decode = decodeJWT(token)
            if (decode && decode.device_info === payload.device_info){
                console.log('вызвано завершение сессии, логаут')
                await authStore.logout()
            }
        }
    }

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

    const react_media = async (payload: {
        entity: 'Photo' | 'Post' | 'Comment',
        reactor: string,
        entity_id: string,
        wasLike: boolean
    }) => {
        console.log('react_media')

        if (!payload.wasLike) {
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
            //дополнителдьно в глоб компоненте постов ексть подписка на это событие, которая управляет локальным стейтом полученного поста и раскидывает его в пропсах
        }
    }

    const publish_post = async (payload: { uid: string, post: Post }) => {
        console.log('publish_post')
        await notifyWithPreload('publish_Post', payload.uid, payload.post._id)
        soundStore.addSound({soundType: 'default', soundCaller: 'publish_photo'})

        if (route.name === 'friends-user' && route.params.id === payload.uid && postStore.posts) {
            await postStore.getPosts('load', undefined, payload.uid, true)
        }
    }

    const reload_posts = async (payload: { post_id?: string, post_owner: string }) => {
        if (route.name === 'friends-user' && route.params.id === payload.post_owner && postStore.posts) {
            await postStore.getPosts('load', undefined, payload.post_owner, true)
        }
        if (route.query.p === payload.post_id){
            await router.push({query: {p: undefined}})
        }
    }

    const publish_comment = async (payload: {text: string, entity_id: string, entity_type: 'Photo' | 'Post' | 'Comment', commentator: string, isReply?: boolean}) => {
        console.log('publish_comment')
        if (payload.isReply){
            await notifyWithPreload(`comment_Comment`, payload.commentator, payload.entity_id, payload.text)
        }else{
            await notifyWithPreload(`comment_${payload.entity_type}`, payload.commentator, payload.entity_id, payload.text)
        }
        soundStore.addSound({soundType: 'default', soundCaller: 'publish_comment'})
    }

    const notifyWithPreload = async (
        type: 'publish_Photo' | 'publish_many_Photo' | 'react_Photo' | 'react_Post' | 'react_Comment' | 'publish_Post' | 'comment_Photo' | 'comment_Post' | 'comment_Comment'
        ,uid: string, entity_id?: string, additional_text?: string
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
            entity_id: entity_id,
            additional_text: additional_text
        })
    }

    return {
        publish_photo,
        publish_many_photo,
        react_media,
        publish_post,
        reload_posts,
        publish_comment,
        reload_sessions,
        session_close
    }
});


