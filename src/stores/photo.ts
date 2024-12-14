import { defineStore } from "pinia";
import apiAuth from "@/utils/apiAuth";
import { ref } from "vue";
import type {Photo} from "@/helpers/interfaces";

export const usePhotoStore = defineStore('photo', () => {
    const pending = ref<boolean>(false);
    const error = ref<string | null>(null);


    const uploadPhoto = async (formData: FormData, info: {key: string, value: any}[]) => {
        pending.value = true;
        error.value = null;

        info.forEach(entry => {
            formData.append(entry.key, entry.value);
        });

        try {
            const response = await apiAuth.post("user/photo", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.data && response.status === 200) {
                console.log(response.data);
            }
        } catch (e: any) {
            error.value = "Произошла ошибка при загрузке фотографий, попробуйте позже";
            console.error(e);
        } finally {
            pending.value = false;
        }
    };


    const photoError = ref<string | null>(null);

    const currentPage = ref<number>(1);
    const perPage = ref<number>(10);

    const loadPending = ref<boolean>(false);
    const loaMorePending = ref<boolean>(false);
    const hasMore = ref<boolean | null>(null);

    const photos = ref<Photo[] | null>(null);

    const getPhotos = async (mode: 'load' | 'load-more', limit?: number, requester?: string, withoutPending?: boolean) => {

        let currentPending = mode === 'load' ? loadPending : loaMorePending;

        if (mode === 'load-more') {
            currentPage.value += 1;
            hasMore.value = null;
        }else{
            currentPage.value = 1;
        }

        if(!withoutPending){
            currentPending.value = true;
        }

        photoError.value = null;

        try {
            const response = await apiAuth.get('user/photo', {
                params: {
                    mode: requester ? 'external' : 'internal',
                    searchUid: requester ? requester : undefined,
                    page: currentPage.value,
                    limit: limit ? limit : perPage.value
                }
            });

            if (response && response.data.photos) {
                hasMore.value = response.data.hasMore;

                if (currentPage.value === 1) {
                    photos.value = response.data.photos;
                } else if (currentPage.value !== 1 && photos.value){
                    photos.value.push(...response.data.photos);
                }
            }
        } catch (e: any) {
            photoError.value = "Произошла ошибка при получении фотографий, попробуйте позже";
            console.error(e);
        } finally {
            if(!withoutPending){
                currentPending.value = false;
            }
        }
    };


    const deletePending = ref<boolean>(false);
    const deleteError = ref<string | null>(null);

    const deletePhoto = async (id: string) => {
        deletePending.value = true;
        deleteError.value = null;

        try {
            await apiAuth.delete('user/photo', {
                params: {
                    photoId: id,
                }
            });

        } catch (e: any) {
            deleteError.value = "Произошла ошибка при удалении фотографии, попробуйте позже";
            console.error(e);
        } finally {
            deletePending.value = false;
        }
    };

    const existPending = ref<boolean>(false);
    const existError = ref<string | null>(null);

    const isPhotoExists = async (phId: string, uid: string) => {
        existPending.value = true;
        existError.value = null;

        try {
            const response = await apiAuth.get('user/gMedia', {
                params: {
                    photoId: phId,
                    userId: uid
                }
            });

            if (response.data && response.status === 200) {
                console.log(response.data);
                return response.data.photo
            }
        } catch (e: any) {
            existError.value = "Произошла ошибка при получении фотографии, попробуйте позже";
            console.error(e);
        } finally {
            existPending.value = false;
        }
    };

    return {
        pending,
        error,
        uploadPhoto,

        photoError,
        currentPage,
        perPage,
        loadPending,
        loaMorePending,
        hasMore,
        photos,
        getPhotos,

        deletePending,
        deleteError,
        deletePhoto,

        existPending,
        existError,
        isPhotoExists,
    };
});
