import { defineStore } from 'pinia';
import { ref } from 'vue';

interface FilterFriend {
    city: string | null,
    age: (string | number)[] | null,
    gender: 'male' | 'female' | null
}

export const useFindFriendFilterStore = defineStore('findFriendFilter', () => {

    const userFindFriendFilter = ref<FilterFriend>({city: null, age: null, gender: null});

    const clearAll = () => {
        userFindFriendFilter.value = {city: null, age: null, gender: null};
    }

    return{
        userFindFriendFilter,
        clearAll
    }
});
