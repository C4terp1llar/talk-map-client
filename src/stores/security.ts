import { defineStore } from "pinia";
import { ref } from "vue";
import apiAuth from "@/utils/apiAuth";
import type {Photo, UserSession} from "@/helpers/interfaces";

export const useSecurityStore = defineStore('security', () => {
    const checkPending = ref<boolean>(false);

    const checkPassword = async (oldPassword: string): Promise<{ match: boolean }> => {
        checkPending.value = true;

        try {
            const response = await apiAuth.get(`user/pass`, {
                params: {
                    p: oldPassword
                }
            })

            const match = !!response.data.match

            return {match};
        } catch (e: any) {
            console.error(e);
            return {match: false};
        } finally {
            checkPending.value = false;
        }
    }

    const pending = ref<boolean>(false);

    const changePassword = async (newPassword: string) :Promise<{message: string, s: 'info' | 'success' | 'error'}> => {
        pending.value = true;

        try {
            const response = await apiAuth.put(`user/pass`, {
                p: newPassword
            })

            return response.data
        } catch (e: any) {
            console.error(e);
            return {message: "Произошла ошибка при изменении пароля, попробуйте позже", s: 'error'}
        } finally {
            pending.value = false;
        }
    }

    const sessionError = ref<string | null>(null);

    const currentPage = ref<number>(1);
    const perPage = 5

    const loadPending = ref<boolean>(false);
    const loaMorePending = ref<boolean>(false);
    const hasMore = ref<boolean | null>(null);

    const activeSession = ref<UserSession | null>(null);
    const sessions = ref<UserSession[] | null>(null);

    const getActiveSessions = async (mode: 'l' | 'l-more', withoutPending?: boolean) => {

        let currentPending = mode === 'l' ? loadPending : loaMorePending;

        if (mode === 'l-more') {
            currentPage.value += 1;
            hasMore.value = null;
        }else{
            currentPage.value = 1;
        }

        if(!withoutPending){
            currentPending.value = true;
        }

        sessionError.value = null;

        try {
            const response = await apiAuth.get(`user/sessions?page=${currentPage.value}&limit=${perPage}`, {withCredentials: true})

            if (response.status === 200 && response.data) {
                activeSession.value = response.data.active;
                hasMore.value = response.data.hasMore;

                if (currentPage.value === 1) {
                    sessions.value = response.data.sessions;
                } else if (currentPage.value !== 1 && sessions.value){
                    sessions.value.push(...response.data.sessions);
                }
            }
        } catch (e: any) {
            sessionError.value = "Произошла ошибка при получении активных сессий, попробуйте позже";
            console.error(e);
        } finally {
            if(!withoutPending){
                currentPending.value = false;
            }
        }
    };

    const sessionsClear = () => {
        sessionError.value = null;
        activeSession.value = null;
        sessions.value = null;
        currentPage.value = 1;
        hasMore.value = null;
    }

    const delPending = ref<boolean>(false);
    const delError = ref<string | null>(null);

    const deleteSession = async (id: string) => {
        delPending.value = true;
        delError.value = null;

        try {
            await apiAuth.delete(`user/sessions/${id}`)
        } catch (e: any) {
            delError.value = "Произошла ошибка при завершении сессии, попробуйте позже";
            console.error(e);
        } finally {
            delPending.value = false;
        }
    };

    return {
        checkPending,
        checkPassword,
        pending,
        changePassword,

        sessionError,
        currentPage,
        perPage,
        loadPending,
        loaMorePending,
        hasMore,
        activeSession,
        sessions,
        getActiveSessions,
        sessionsClear,

        delPending,
        delError,
        deleteSession,
    };
});
