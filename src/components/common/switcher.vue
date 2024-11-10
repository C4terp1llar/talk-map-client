<script setup lang="ts">
const emit = defineEmits(['switch']);

interface Props {
  check: boolean,
  disabled: boolean,
}
const props = defineProps<Props>()
</script>

<template>
  <div class="theme-switcher">
    <label class="switch">
      <input type="checkbox" :disabled="props.disabled" :checked="props.check" @change="emit('switch')"/>
      <span class="slider"></span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.theme-switcher {
  display: flex;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: rgb(var(--v-theme-background));
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4CAF50;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider:before {
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}
</style>