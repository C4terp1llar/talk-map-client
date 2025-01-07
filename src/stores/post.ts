import { defineStore } from "pinia";
import apiAuth from "@/utils/apiAuth";
import { ref } from "vue";
import type {Photo, Post, PostOwner} from "@/helpers/interfaces";

export const usePostStore = defineStore('post', () => {
    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);

    const createPost = async (postText: string, formData: FormData | undefined, info: {key: string, value: any}[]) => {
        pending.value = true;
        error.value = null;

        let lcData: FormData;

        if (formData){
            info.forEach(entry => {
                formData.append(entry.key, entry.value);
            });

            formData.append('text', postText);
            lcData = formData
        }else{
            lcData = new FormData();
            lcData.append('text', postText);
            info.forEach(entry => {
                lcData.append(entry.key, entry.value);
            });
        }

        try {
            const response = await apiAuth.post("user/post", lcData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.data && response.status === 200) {
                console.log(response.data);
            }
        } catch (e: any) {
            error.value = "Произошла ошибка при создании поста, попробуйте позже";
            console.error(e);
        } finally {
            pending.value = false;
        }
    };

    const postPage = ref<number>(1);
    const perPage = ref<number>(15);

    const postsError = ref<string | null>(null);
    const load = ref<boolean>(false);
    const loadMore = ref<boolean>(false);
    const hasMore = ref<boolean | null>(null);

    const posts = ref<Post[] | null>(null);
    const postOwnerInfo = ref<PostOwner | null>(null)

    const getPosts = async (mode: 'load' | 'load-more', limit?: number, requester?: string, withoutPending?: boolean) => {

        let currentPending = mode === 'load' ? load : loadMore;

        if (mode === 'load-more') {
            postPage.value += 1;
            hasMore.value = null;
        }else{
            postPage.value = 1;
        }

        if(!withoutPending){
            currentPending.value = true;
        }

        postsError.value = null;

        try {
            const response = await apiAuth.get('user/post', {
                params: {
                    mode: requester ? 'external' : 'internal',
                    searchUid: requester ? requester : undefined,
                    page: postPage.value,
                    limit: limit ? limit : perPage.value
                }
            });

            if (response.status === 200 && response.data) {
                hasMore.value = response.data.hasMore;

                if (postPage.value === 1) {
                    posts.value = response.data.posts;
                    postOwnerInfo.value = response.data.ownerInfo;
                } else if (postPage.value !== 1 && posts.value){
                    posts.value.push(...response.data.posts);
                }
            }
        } catch (e: any) {
            postsError.value = "Произошла ошибка при получении постов, попробуйте позже";
            console.error(e);
        } finally {
            if(!withoutPending){
                currentPending.value = false;
            }
        }
    };

    const getPost = async (postId: string): Promise<{ posts: Post[]; ownerInfo: PostOwner | null }> => {
        postsError.value = null;

        try {
            const response = await apiAuth.get(`user/post/${postId}`)

            if (response.status === 200 && response.data) {
                return response.data;
            }else{
                return {posts: [], ownerInfo: null}
            }
        } catch (e: any) {
            postsError.value = "Произошла ошибка при получении поста, попробуйте позже";
            console.error(e);
            return { posts: [], ownerInfo: null };
        }
    };

    const delPostPending = ref<boolean>(false);
    const delPostError = ref<string | null>(null);

    const deletePost = async (postId: string) => {
        delPostPending.value = true;
        delPostError.value = null;

        try {
            await apiAuth.delete(`user/post/${postId}`)

        } catch (e: any) {
            delPostError.value = "Произошла ошибка при удалении поста, попробуйте позже";
            console.error(e);
        } finally {
            delPostPending.value = false;
        }
    };


    const commentError = ref<string | null>(null);

    const getComments = async (
        mode: 'comments' | 'replies', entityType: 'Publication' | 'Post' | 'Comment', entityId: string, page: number = 1, limit: number = 15, parentCommentId?: string, withoutPending?: boolean
    ) => {

        if (mode === 'replies' && !parentCommentId) return;
        commentError.value = null;

        try {
            const response = await apiAuth.get('user/comment', {
                params: {
                    entityType,
                    entityId,
                    page,
                    limit,
                    parentCommentId
                }
            });

            if (response.status === 200 && response.data) {
                return response.data
            }
        } catch (e: any) {
            commentError.value = "Произошла ошибка при получении комментариев, попробуйте позже";
            console.error(e);
        }
    };

    const createCommPending = ref<boolean>(false);
    const createCommError = ref<string | null>(null);

    const createComment = async (entityType: 'Publication' | 'Post' | 'Comment', entityId: string, text: string, parentCommentId?: string) => {
        createCommPending.value = true;
        createCommError.value = null;

        try {
            await apiAuth.post(`user/comment`, {
                entityType,
                entityId,
                text,
                parentCommentId
            })

        } catch (e: any) {
            createCommError.value = "Произошла ошибка при создании комментария, попробуйте позже";
            console.error(e);
        } finally {
            createCommPending.value = false;
        }
    };


    return {
        pending,
        error,
        createPost,

        postPage,
        perPage,
        postsError,
        load,
        loadMore,
        hasMore,
        posts,
        postOwnerInfo,
        getPosts,
        getPost,

        delPostPending,
        delPostError,
        deletePost,

        commentError,
        getComments,

        createCommPending,
        createCommError,
        createComment,

    };
});
