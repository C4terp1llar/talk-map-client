import {defineStore} from "pinia";
import {ref} from "vue";

interface SoundsQueue {
    soundType: 'default' | 'message';
    soundCaller: string;
}

export const useSoundsStore = defineStore('sounds', () => {

    const soundsQueue = ref<SoundsQueue[]>([]);
    const isPlaying = ref(false);

    const SOUND_MAP = {
        default: '/sounds/n5.mp3',
        message: '/sounds/n3.mp3',
    };

    const SOUND_DURATION_MAP = {
        default: 1200,
        message: 1100,
    };

    const addSound = (payload: SoundsQueue) => {
        soundsQueue.value.push(payload);
        if (!isPlaying.value) {
            playNextSound();
        }
    };


    const playNextSound = () => {
        if (!soundsQueue.value.length || isPlaying.value) return;

        isPlaying.value = true;

        const { soundType } = soundsQueue.value.shift()!;

        const soundFile = SOUND_MAP[soundType] || SOUND_MAP.default;
        const soundDuration = SOUND_DURATION_MAP[soundType] || 2000;

        const audio = new Audio(soundFile);

        audio.play()
            .then(() => {
                setTimeout(() => {
                    isPlaying.value = false;
                    playNextSound();
                }, soundDuration);
            })
            .catch((error) => {
                console.error("Ошибка воспроизведения звука:", error);
                isPlaying.value = false;
                playNextSound();
            });
    };

    return {
        soundsQueue,
        addSound,
        playNextSound,
    };
});
