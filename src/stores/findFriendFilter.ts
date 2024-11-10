import { defineStore } from 'pinia';
import {ref} from 'vue';
import type {Address, ShortAddress} from "@/helpers/interfaces";
import api from "@/utils/api";

export const useFindFriendFilterStore = defineStore('findFriendFilter', () => {

    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);

    const cityFilter = ref<string | null>(null);
    const nickFilter = ref<string | null>(null);
    const minAgeFilter = ref<number>(14);
    const maxAgeFilter = ref<number>(100);
    const genderFilter = ref<'male' | 'female' | 'any'>('any');
    const globalSearch = ref<boolean>(true);


    const clearAll = () => {
        cityFilter.value = null;
        nickFilter.value = null;
        minAgeFilter.value = 14;
        maxAgeFilter.value = 100;
        genderFilter.value = 'any';
        guessCities.value = [];
        globalSearch.value = true;
    }

    const guessCities = ref<ShortAddress[]>([]);

    const getAddresses = async (clientAddressQuery: string) => {
        pending.value = true;
        error.value = null;

        try {
            const response = await api.post('reg/getCitiesByQ', {
                query: clientAddressQuery,
                filter: 'onlyTowns'
            });

            if (response.data.message){
                return response.data.message;
            }else{
                guessCities.value = response.data
            }
        } catch (e) {
            error.value = "Произошла ошибка при поиске адреса, попробуйте позже";
            console.error(e);
        } finally {
            pending.value = false;
        }
    };

    return{
        cityFilter,
        minAgeFilter,
        maxAgeFilter,
        genderFilter,
        nickFilter,
        globalSearch,
        clearAll,

        pending,
        error,
        guessCities,
        getAddresses,
    }
});
