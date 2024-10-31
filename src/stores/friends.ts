import {defineStore} from "pinia";
import {ref} from "vue";
import apiAuth from "@/utils/apiAuth";
import type {FriendRequest} from "@/helpers/interfaces";


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

    const getFriendReqs = async (mode: 'incoming' | 'outgoing', pendingMode: 'load' | 'load-more') => {

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
        viewMode
    }
})