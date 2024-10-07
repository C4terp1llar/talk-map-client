<script setup lang="ts">
import {onUnmounted, ref} from 'vue';
import {useProfilePreviewStore} from "@/stores/profilePreview";

const profilePreview = useProfilePreviewStore()

const hue = ref(profilePreview.colorValue || 0);

const getColor = () => {
  return `hsl(${profilePreview.colorValue}, 100%, 50%)`;
};

onUnmounted(() => {
  profilePreview.newUserNicknameColor = null;
  profilePreview.colorValue = 0
})
</script>

<template>

    <input
        type="range"
        min="0"
        max="360"
        v-model="profilePreview.colorValue"
        class="slider"
        @input="profilePreview.newUserNicknameColor = getColor()"
    />

</template>

<style scoped>

.slider {
  width: 100%;
  appearance: none;
  height: 15px;
  background: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red);
  outline: none;
  border-radius: 15px;
}

/* стилизация кружка */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 5px solid currentColor;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 5px solid currentColor;
  cursor: pointer;
}
</style>
