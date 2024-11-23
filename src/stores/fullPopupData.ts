import {defineStore} from "pinia";
import {ref} from "vue";
import apiAuth from "@/utils/apiAuth";
import {useNotificationStore} from "@/stores/notifications";


export const useFullPopupData = defineStore('popupData', () => {
    const notificationsStore = useNotificationStore();


    const currentPage = ref<number>(1);
    const perPage = ref<number>(10);

    const pending = ref<boolean>(false);
    const morePending = ref<boolean>(false);

    const error = ref<string | null>(null);

    const hasMore = ref<boolean | null>(null);

    const fullMutualClear = () => {
        currentPage.value = 1;
        hasMore.value = null;
    }

    const getMutualFriends = async (pendingMode: 'load' | 'load-more', id: string) => {

        let currentPending = pendingMode === 'load' ? pending : morePending;

        if (pendingMode === 'load-more') {
            currentPage.value += 1;
            hasMore.value = null;
        }else{
            currentPage.value = 1;
        }

        currentPending.value = true;
        error.value = null;

        try {

            const response = await apiAuth.post('user/getMutualFriends',{
                searchUid: id,
                page: currentPage.value,
                limit: perPage.value,
            })


            if (response.status === 200 && response.data){
                hasMore.value = response.data.mutual.hasMore;

                return response.data.mutual.mFriends
            }
        } catch (e: any) {
            error.value = "Произошла ошибка при получении общих друзей, попробуйте позже";
            notificationsStore.addNotification('error', error.value, 3000)
            console.error(e);
        } finally {
            currentPending.value = false;
        }
    }


    const findFriends = async (mode: 'load' | 'load-more', limit?: number, requester?: string) => {

        let currentPending = mode === 'load' ? pending : morePending;

        if (mode === 'load-more') {
            currentPage.value += 1;
            hasMore.value = null;
        }else{
            currentPage.value = 1;
        }

        currentPending.value = true;
        error.value = null;

        try {
            const response = await apiAuth.post('user/findUsers', {
                globalSearch: false,
                cityFilter: null,
                minAgeFilter: 14,
                maxAgeFilter: 100,
                genderFilter: "any",
                nicknameFilter: null,
                page: currentPage.value,
                limit: limit || perPage.value,
                requester
            });

            if (response && response.data) {
                hasMore.value = response.data.hasMore;

                return response.data.users
            }
        } catch (e: any) {
            error.value = "Произошла ошибка при поиске друзей пользователя, попробуйте позже";
            notificationsStore.addNotification('error', error.value, 3000)
            console.error(e);
        } finally {
            currentPending.value = false;
        }
    };

    return{
        fullMutualClear,
        currentPage,
        perPage,
        pending,
        morePending,
        error,
        hasMore,
        getMutualFriends,
        findFriends,
    }
})