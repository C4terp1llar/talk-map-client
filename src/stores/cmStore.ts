import {defineStore} from "pinia";
import {ref} from "vue";
import apiAuth from "@/utils/apiAuth";
import {useNotificationStore} from "@/stores/notifications";
import type {
    ConvMemberInfo,
    FullMessage,
    GroupConv,
    MediaConvInfo,
    PersonalConv, ShortFriend, ShortMediaDialogMessage,
    ShortUserInfo, UploadMediaFile
} from "@/helpers/interfaces";
import {useRoute} from "vue-router";

export const useCmStore = defineStore('cm', () => {
    const route = useRoute();
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

            if (response.data && response.status === 201) {
                return response.data.message
            }
        } catch (e: any) {
            error.value = `Произошла ошибка при отправке сообщения, попробуйте позже`;
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
    const withoutConversations = ref<ShortUserInfo[] | null>(null);

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
                    withoutConversations.value = response.data.withoutConversations;
                }else if(page >= 2 && conversations.value){
                    conversations.value.push(response.data.conversations);
                }else if(page >= 2 && withoutConversations.value){
                    withoutConversations.value.push(response.data.withoutConversations);
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

    const getMessages = async (convId: string, page: number, limit: number, withoutPending?: boolean) => {
        const curPending = page <= 1 ? messagesPend : messagesPendMore;

        if (!withoutPending){
            curPending.value = true;
        }

        try {

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
            if (e.response.status !== 400){
                ntfStore.addNotification('error', 'Произошла ошибка при получении сообщений, попробуйте позже')
            }
        }finally{
            curPending.value = false;
        }
    }


    const selectedDialogId = ref<string | null>(route.query.conv ? route.query.conv.toString() : null);
    const selectedDialog = ref<PersonalConv | GroupConv | null>(null);

    const getDialogPend = ref<boolean>(false);

    const getDialogInfo = async (convId: string, returns?: boolean, withoutPending?: boolean) : Promise<PersonalConv | GroupConv | void> => {
        if (!withoutPending){
           getDialogPend.value = true;
       }

        try {
            const response = await apiAuth.get(`user/conv/${convId}`)

            if (response.status === 200 && response.data){
                if (returns){
                    return response.data.dialog
                }else{
                    selectedDialog.value = response.data.dialog;
                }
            }
        } catch (e: any) {
            console.error(e);
            if (e.response.status !== 400){
                ntfStore.addNotification('error', 'Произошла ошибка при получении диалога, попробуйте позже')
            }
        }finally{
            getDialogPend.value = false;
        }
    }

    const compositeDialogPend = ref<boolean>(messagesPend.value || getDialogPend.value);

    const unmountMsgClear = () => {
        messages.value = null
        hasMoreMessages.value = false
        messagesPend.value = false
        messagesPendMore.value = false
        selectedDialogId.value = null
        selectedDialog.value = null
        newDialogOpponent.value = null
    }

    const newPersonalConvOpponentUid = ref<string | null>(route.query.nConv ? route.query.nConv.toString() : null);

    // /conv/new/:uid

    const getNewDialogPend = ref<boolean>(false);
    const newDialogOpponent = ref<ShortUserInfo | null>(null);

    const getNewPersonalDialogInfo = async (opponent: string) => {
        getNewDialogPend.value = true;

        try {
            const response = await apiAuth.get(`user/conv/new/${opponent}`)

            if (response.status === 200 && response.data){
                newDialogOpponent.value = response.data.user
            }

        } catch (e: any) {
            console.error(e);
            if (e.response.status === 500){
                ntfStore.addNotification('error', 'Произошла ошибка при получении пользователя для нового диалога, попробуйте позже')
            }
        } finally {
            getNewDialogPend.value = false;
        }
    }

    const getGroupMembers = async (convId: string, page: number, limit: number) :Promise<{members: ConvMemberInfo[], sender: ConvMemberInfo, hasMore: boolean} | void> => {

        try {
            const response = await apiAuth.get(`user/conv/${convId}/members`, {
                params: {
                    page, limit
                }
            })

            if (response.status === 200 && response.data){
                return response.data;
            }

        } catch (e: any) {
            console.error(e);
            if (e.response.status === 500){
                ntfStore.addNotification('error', 'Произошла ошибка при получении участников группы, попробуйте позже')
            }
        }
    }

    const changeMemberRole = async (convId: string, targetMember: string, role: 'admin' | 'owner' | 'member') => {

        try {
            const response = await apiAuth.patch(`user/conv/${convId}/members/role`, {
                targetMember, role
            })

            if (response.status === 200 && response.data){
                return response.data
            }

        } catch (e: any) {
            console.error(e);
            if (e.response.status === 500){
                ntfStore.addNotification('error', 'Произошла ошибка при изменении роли участника, попробуйте позже')
            }
        }
    }

    const kickGroupMember = async (convId: string, targetMember: string) => {

        try {
            const response = await apiAuth.delete(`user/conv/${convId}/members/${targetMember}`)

            if (response.status === 200 && response.data){
                return response.data
            }

        } catch (e: any) {
            console.error(e);
            if (e.response.status === 500){
                ntfStore.addNotification('error', 'Произошла ошибка при исключении участника, попробуйте позже')
            }
        }
    }

    const leaveGroup = async (convId: string) => {
        try {
            const response = await apiAuth.delete(`user/conv/${convId}/leave`)

            if (response.status === 200 && response.data){
                return response.data
            }

        } catch (e: any) {
            console.error(e);
            if (e.response.status === 500){
                ntfStore.addNotification('error', 'Произошла ошибка при выходе из группы, попробуйте позже')
            }
        }
    }


    const getGroupMedia = async (convId: string, mode: 'image' | 'video' | 'files', page: number, limit: number) :Promise<{media: MediaConvInfo[], hasMore: boolean} | void> => {
        try {
            const response = await apiAuth.get(`user/conv/${convId}/media`, {params: {mode, page, limit}})

            if (response.status === 200 && response.data){
                return response.data
            }

        } catch (e: any) {
            console.error(e);
            if (e.response.status === 500){
                ntfStore.addNotification('error', 'Произошла ошибка при получении медиа из диалога, попробуйте позже')
            }
        }
    }

    const reloadMessagesAndDialogs = async () => {
        if (!selectedDialogId.value || !selectedDialog.value || !messages.value || !messages.value.length || !conversations.value || !conversations.value.length) return;

        const [dialog] = await Promise.all([
            getDialogInfo(selectedDialogId.value, true, true),
            getMessages(selectedDialogId.value, 1 ,200 , true)
        ])

        if (dialog) {
            const index = conversations.value.findIndex((conv) => conv._id === selectedDialogId.value);

            if (index !== -1) {
                conversations.value.splice(index, 1);
                conversations.value.unshift(dialog);
            } else {
                conversations.value.unshift(dialog);
            }
        }
    }

    const fullReloadMessagesAndDialogs = async (convId: string, dialogSelected?: boolean) => {

        const [dialog] = await Promise.all([
            getDialogInfo(convId, true, true),
            dialogSelected ? getMessages(convId, 1 ,200 , true) : Promise.resolve()
        ])

        if (dialog && conversations.value) {
            const index = conversations.value.findIndex((conv) => conv._id === convId);

            if (index !== -1) {
                conversations.value.splice(index, 1);
                conversations.value.unshift(dialog);
            } else {
                conversations.value.unshift(dialog);
            }
        }
    }

    const changeMsgReload = async () => {
        if (!selectedDialogId.value || !conversations.value) return;

        const [currDialog] = await Promise.all([
            getDialogInfo(selectedDialogId.value, true, true),
            getMessages(selectedDialogId.value, 1 ,200 , true)
        ])

        if (currDialog) {
            const index = conversations.value.findIndex((conv) => conv._id === selectedDialogId.value);

            if (index !== -1) {
                conversations.value[index] = currDialog;
            } else {
                conversations.value.unshift(currDialog)
            }
        }
    }

    const reloadDialogs = async () =>  {
        if (!selectedDialogId.value || !selectedDialog.value || !conversations.value || !conversations.value.length) return;

        const dialog = await getDialogInfo(selectedDialogId.value, true, true)

        if (dialog) {
            const index = conversations.value.findIndex((conv) => conv._id === selectedDialogId.value);

            if (index !== -1) {
                conversations.value.splice(index, 1);
                conversations.value.unshift(dialog);
            } else {
                conversations.value.unshift(dialog);
            }
        }
    }

    const addMembersFlag = ref<boolean>(false)

    const getNewMembers = async (convId: string, page: number, limit: number, q?: string): Promise<{friends: ShortFriend[] | null, hasMore: boolean}> => {
        try {
            const response = await apiAuth.get(`user/conv/${convId}/new/members`, {
                params: {
                    q, page, limit
                }
            })

            if (response.status === 200 && response.data){
                return {friends: response.data.friends, hasMore: response.data.hasMore}
            }
            return {friends: null, hasMore: false}
        } catch (e: any) {
            console.error(e);
            return {friends: null, hasMore: false}
        }
    }

    const addMembersPend = ref<boolean>(false)

    const addNewMembers = async (convId: string, members: string[]) => {
        try {
            addMembersPend.value = true;
            const response = await apiAuth.post(`user/conv/${convId}/new/members`, {
                members
            })

            if(response.status === 200){
                ntfStore.addNotification('success', `${members.length >= 2 ? 'Участники успешно добавлены!' : 'Участник успешно добавлен!'}`)
            }
        } catch (e: any) {
            console.error(e);
            if (e.response.status === 500){
                ntfStore.addNotification('error', 'Произошла ошибка при добавлении участников, попробуйте позже')
            }
        }finally{
            addMembersPend.value = false;
        }
    }

    const getMembersMe = async (convId: string) :Promise<{user_id: string, role: 'owner' | 'admin' | 'member', canChange: boolean} | void> => {
        try {
            const response = await apiAuth.get(`user/conv/${convId}/members/me`)

            if(response.status === 200 && response.data){
                return {...response.data, canChange: ((response.data.role === 'owner' || response.data.role === 'admin'))};
            }
        } catch (e: any) {
            console.error(e);
            if (e.response.status === 500){
                ntfStore.addNotification('error', 'Произошла ошибка при получении информации о учаснике, попробуйте позже')
            }
        }
    }

    const changeGroupTitle = async (convId: string, newTitle: string) :Promise<string | void> => {
        try {
            const response = await apiAuth.patch(`user/conv/${convId}/title`, {newTitle})

            if(response.status === 200 && response.data){
                return newTitle.trim()
            }
        } catch (e: any) {
            console.error(e);
            if (e.response.status === 500){
                ntfStore.addNotification('error', 'Произошла ошибка при изменении названия группы, попробуйте позже')
            }
        }
    }

    const changeGroupCover = async (convId: string, newCover: string | ArrayBuffer) :Promise<{cover_url: string, cover_id: string } | void> => {
        try {
            const response = await apiAuth.patch(`user/conv/${convId}/cover`, {newCover})

            if(response.status === 200 && response.data){
                return response.data
            }
        } catch (e: any) {
            console.error(e);
            if (e.response.status === 500){
                ntfStore.addNotification('error', 'Произошла ошибка при изменении аватара группы, попробуйте позже')
            }
        }
    }

    const deleteMessage = async (convId: string, mId: string) => {
        try {
            await apiAuth.delete(`user/message/${mId}`, {params: {convId}})

        } catch (e: any) {
            console.error(e);
            if (e.response.status === 500){
                ntfStore.addNotification('error', 'Произошла ошибка при удалении сообщения, попробуйте позже')
            }
        }
    }

    const getAttachedFiles = async (media: ShortMediaDialogMessage[]): Promise<UploadMediaFile[] | void> => {
        try {
            const filePromises = media.map(async (item) => {
                const response = await fetch(item.url);

                if (!response.ok) {
                    throw new Error(`Ошибка загрузки файла: ${response.status}`);
                }

                const blob = await response.blob();
                const file = new File([blob], item.name, { type: item.type });

                // Используем URL.createObjectURL для видео и изображений
                const previewUrl = (item.type.startsWith('image') || item.type.startsWith('video'))
                    ? URL.createObjectURL(blob)
                    : item.url; // Для других типов можно оставить URL как есть

                return {
                    id: item._id,
                    file: file,
                    previewUrl: previewUrl,
                    type: item.type,
                };
            });

            return await Promise.all(filePromises);
        } catch (e: any) {
            console.error(e);
            if (e.response?.status === 500) {
                ntfStore.addNotification('error', 'Произошла ошибка при получении вложений сообщения, попробуйте позже');
            }
        }
    };

    const changeMsgData = ref<{attaches: UploadMediaFile[] | [], message: FullMessage} | null>(null);

    const changeMsg = async (data: FormData, mId: string) => {
        pending.value = true;
        error.value = null;

        try {
            const response = await apiAuth.put(`user/message/${mId}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.data && response.status === 200) {
                return response.data.message
            }
        } catch (e: any) {
            error.value = `Произошла ошибка при изменении сообщения, попробуйте позже`;
            console.error(e);
        } finally {
            pending.value = false;
        }
    };

    const replyMessage = ref<FullMessage | null>(null);

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
        withoutConversations,
        hasMoreConv,
        messages,
        hasMoreMessages,
        messagesPend,
        messagesPendMore,
        getMessages,
        unmountMsgClear,
        selectedDialogId,
        selectedDialog,
        getDialogPend,
        getDialogInfo,
        compositeDialogPend,
        newPersonalConvOpponentUid,
        getNewPersonalDialogInfo,
        getNewDialogPend,
        newDialogOpponent,
        getGroupMembers,
        changeMemberRole,
        kickGroupMember,
        leaveGroup,
        getGroupMedia,
        reloadMessagesAndDialogs,
        fullReloadMessagesAndDialogs,
        reloadDialogs,
        changeMsgReload,
        addMembersFlag,
        getNewMembers,
        addNewMembers,
        addMembersPend,
        getMembersMe,
        changeGroupTitle,
        changeGroupCover,
        deleteMessage,
        getAttachedFiles,
        changeMsgData,
        changeMsg,
        replyMessage
    }
});