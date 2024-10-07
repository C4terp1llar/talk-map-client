import {defineStore} from "pinia";
import {ref} from "vue";

export const useProfilePreviewStore = defineStore('profilePreview', () => {

    const newUserNickname = ref<string>()
    const newUserNicknameColor = ref<string | null>(null)

    const colorValue = ref<number>(0)

    return {
        newUserNickname,
        newUserNicknameColor,
        colorValue
    }
})