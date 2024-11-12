import {defineStore} from "pinia";
import {ref} from "vue";
import apiAuth from "@/utils/apiAuth";
import type {FriendRequest, ShortMutualUserFriend} from "@/helpers/interfaces";


export const useFriendsStore = defineStore('friends', () => {
    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);

    const viewMode = ref<'incoming' | 'outgoing' | 'friends' | null>(null);

    const currentPage = ref<number>(1);
    const perPage = ref<number>(10);

    const loadMoreFlag = ref<boolean>(false)
    const hasMoreFlag = ref<boolean | null>(null);

    const loadMorePending = ref<boolean>(false);

    const foundRequests = ref<FriendRequest[] | null>(null);

    const unmountClear = () => {
        currentPage.value = 1;
        loadMoreFlag.value = false;
        hasMoreFlag.value = null;
        foundRequests.value = null;
        viewMode.value = null;
    }

    const getFriendReqs = async (mode: 'incoming' | 'outgoing' | 'friends', pendingMode: 'load' | 'load-more') => {

        let currentPending = pendingMode === 'load' ? pending : loadMorePending;

        if (pendingMode === 'load-more') {
            currentPage.value += 1;
            hasMoreFlag.value = null;
        }else{
            currentPage.value = 1;
        }

        currentPending.value = true;
        error.value = null;

        try {
            const response = await apiAuth.post('user/getFriendReqs',{
                mode,
                page: currentPage.value,
                limit: perPage.value,
            })

            if (response.status === 200 && response.data){
                hasMoreFlag.value = response.data.hasMore;

                if (currentPage.value === 1) {
                    foundRequests.value = response.data.requests;
                } else if (currentPage.value !== 1 && foundRequests.value){
                    foundRequests.value.push(...response.data.requests);
                }
            }
        } catch (e: any) {
            error.value = "Произошла ошибка при получении заявок в друзья, попробуйте позже";
            console.error(e);
        } finally {
            currentPending.value = false;
        }
    }

    const mutualPending = ref<boolean>(false);
    const mutualMorePending = ref<boolean>(false);

    const mutualError = ref<string | null>(null);
    const hasMoreMutual = ref<boolean | null>(null);

    const foundMutual = ref<ShortMutualUserFriend[] | null>(null);

    const currentPageMutual = ref<number>(1);

    const mutualClear = () => {
        currentPageMutual.value = 1;
        hasMoreMutual.value = null;
        foundMutual.value = null;
    }

    const getMutualFriends = async (pendingMode: 'load' | 'load-more', id: string) => {

        let currentPending = pendingMode === 'load' ? mutualPending : mutualMorePending;

        if (pendingMode === 'load-more') {
            currentPageMutual.value += 1;
            hasMoreMutual.value = null;
        }else{
            currentPageMutual.value = 1;
        }

        currentPending.value = true;
        mutualError.value = null;

        try {
            const response = await apiAuth.post('user/getMutualFriends',{
                searchUid: id,
                page: currentPageMutual.value,
                limit: perPage.value,
            })

            if (response.status === 200 && response.data){
                hasMoreMutual.value = response.data.mutual.hasMore;

                if (currentPageMutual.value === 1) {
                    foundMutual.value = response.data.mutual.mFriends;
                } else if (currentPageMutual.value !== 1 && foundMutual.value){
                    foundMutual.value.push(...response.data.mutual.mFriends);
                }
            }
        } catch (e: any) {
            error.value = "Произошла ошибка при получении общих друзей, попробуйте позже";
            console.error(e);
        } finally {
            currentPending.value = false;
        }
    }


    const oneUserPending = ref<boolean>(false);
    const oneUserError = ref<string | null>(null);

    const getOneUser = async (targetUid: string, needMutual: boolean) => {
        oneUserPending.value = true;
        oneUserError.value = null;

        try {
            const response = await apiAuth.post('user/getOneFriend',{
                targetUid,
                needMutual
            })

            if (response.status === 200 && response.data){
                return response.data.user
            }
        } catch (e: any) {
            oneUserError.value = "Произошла ошибка при получении информации, попробуйте позже";
            console.error(e);
        } finally {
            oneUserPending.value = false;
        }
    }

    return{
        pending,
        error,
        currentPage,
        perPage,
        loadMoreFlag,
        hasMoreFlag,
        loadMorePending,
        foundRequests,
        unmountClear,
        getFriendReqs,
        viewMode,

        mutualPending,
        mutualMorePending,
        mutualError,
        hasMoreMutual,
        foundMutual,
        currentPageMutual,
        getMutualFriends,
        mutualClear,

        oneUserPending,
        oneUserError,
        getOneUser,
    }
})