import {defineStore} from "pinia";
import {ref} from "vue";
import apiAuth from "@/utils/apiAuth";
import {useNotificationStore} from "@/stores/notifications";

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

    return{
        pending,
        error,
        createMsg,
        checkGroupPending,
        checkGroup,
    }
});