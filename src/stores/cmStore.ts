import {defineStore} from "pinia";
import {ref} from "vue";
import apiAuth from "@/utils/apiAuth";
import {useNotificationStore} from "@/stores/notifications";
import type {FullMessage, GroupConv, PersonalConv} from "@/helpers/interfaces";

export const useCmStore = defineStore('cm', () => {
    const ntfStore = useNotificationStore();

    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);

    const createMsg = async (data: FormData) => {
        pending.value = true;
        error.value = null;

        try {
            const response = await apiAuth.post("user/message", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.data && response.status === 200) {
                console.log(response.data);
            }
        } catch (e: any) {
            error.value = "Произошла ошибка при отправке сообщения, попробуйте позже";
            console.error(e);
        } finally {
            pending.value = false;
        }
    };

    const checkGroupPending = ref<boolean>(false);

    const checkGroup = async (title: string): Promise<{ match: boolean }> => {
        checkGroupPending.value = true;

        try {
            const response = await apiAuth.get(`user/group/check?title=${title}`)

            const match = !!response.data.match

            return {match};
        } catch (e: any) {
            console.error(e);
            ntfStore.addNotification('error', 'Произошла ошибка при проверке названия группы, попробуйте позже')
            return {match: false};
        } finally {
            checkGroupPending.value = false;
        }
    }

    const createGroupPending = ref<boolean>(false);

    const createGroup = async (title: string, description: string, members: string[], cover: string | ArrayBuffer) => {
        createGroupPending.value = true;

        try {
            const response = await apiAuth.post(`user/group`, {
                title,
                description,
                members,
                cover,
            })

            console.log(response)
        } catch (e: any) {
            console.error(e);
            ntfStore.addNotification('error', 'Произошла ошибка при создании группы, попробуйте позже')
        } finally {
            createGroupPending.value = false;
        }
    }

    const conversations = ref<[PersonalConv | GroupConv] | null>(null);
    const hasMoreConv = ref<boolean>(false);

    const getConversations = async (page: number, limit: number, q?: string) => {
        try {
            const response = await apiAuth.get('user/conv', {
                params: {
                    q, page, limit
                }
            })

            if (response.status === 200 && response.data){
                hasMoreConv.value = response.data.hasMore;
                if (page < 2){
                    conversations.value = response.data.conversations;
                }else if(page >= 2 && conversations.value){
                    conversations.value.push(response.data.conversations);
                }
            }

        } catch (e: any) {
            console.error(e);
            ntfStore.addNotification('error', 'Произошла ошибка при получении диалогов, попробуйте позже')
        }
    }

    const messages = ref<FullMessage[] | null>(null);
    const hasMoreMessages = ref<boolean>(false);
    const messagesPend = ref<boolean>(false);
    const messagesPendMore = ref<boolean>(false);

    const getMessages = async (convId: string, page: number, limit: number) => {
        try {
            const curPending = page <= 1 ? messagesPend : messagesPendMore;
            curPending.value = true;

            const response = await apiAuth.get('user/message', {
                params: {
                    convId, page, limit
                }
            })

            if (response.status === 200 && response.data){
                hasMoreMessages.value = response.data.hasMore;

                if (page < 2){
                    messages.value = response.data.messages;
                }else if(page >= 2 && messages.value){
                    messages.value.unshift(response.data.messages);
                }
            }
        } catch (e: any) {
            console.error(e);
            ntfStore.addNotification('error', 'Произошла ошибка при получении сообщений, попробуйте позже')
        }
    }

    const unmountMsgClear = () => {
        messages.value = null
        hasMoreMessages.value = false
        messagesPend.value = false
        messagesPendMore.value = false
    }

    return{
        pending,
        error,
        createMsg,
        checkGroupPending,
        checkGroup,
        createGroupPending,
        createGroup,
        getConversations,
        conversations,
        hasMoreConv,
        messages,
        hasMoreMessages,
        messagesPend,
        messagesPendMore,
        getMessages,
        unmountMsgClear,
    }
});