<script setup lang="ts">
import { ref } from "vue";
import SwitchTemplate from "@/components/switchTemplate.vue";

const isNtfEnable = ref<boolean>(localStorage.getItem('ntf_enable') ? localStorage.getItem('ntf_enable') === 'true' : true);
const isNtfSoundEnable = ref<boolean>(localStorage.getItem('ntf_sound_enable') ? localStorage.getItem('ntf_sound_enable') === 'true' : true);

const handleNtfSwitch = () => {
  isNtfEnable.value = !isNtfEnable.value;
  localStorage.setItem('ntf_enable', String(isNtfEnable.value));
}

const handleNtfSoundSwitch = () => {
  isNtfSoundEnable.value = !isNtfSoundEnable.value;
  localStorage.setItem('ntf_sound_enable', String(isNtfSoundEnable.value));
}
</script>

<template>
  <div class="switcher-ntf__wrapper">
    <switch-template @switch="handleNtfSwitch" name="Уведомления" :disabled="false" :check="isNtfEnable"/>
    <switch-template @switch="handleNtfSoundSwitch" name="Звук" :disabled="false" :check="isNtfSoundEnable"/>
  </div>
</template>

<style scoped lang="scss">
.switcher-ntf__wrapper{
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
