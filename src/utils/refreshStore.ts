import {ref} from "vue";

const pending = ref<boolean>(false)

const setPendingStart = () => pending.value = true
const setPendingEnd = () => pending.value = false

export {
    pending,
    setPendingStart,
    setPendingEnd,
}

