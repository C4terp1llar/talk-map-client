<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores/user";

interface Props {
  mode: "friends" | "communications" | "notifications";
  isFriendsTab?: boolean;
}

const props = defineProps<Props>();
const userStore = useUserStore();

const currentCounter = computed(() => {
  if (props.mode === "friends" && userStore.rsAmount) {
    return userStore.rsAmount;
  }

  return 0;
});

const displayCount = (val: number) => {
  return val > 99 ? "99+" : val;
};
</script>

<template>
  <div :class="['counter__wrapper', { '__friends-tab': isFriendsTab }]" v-if="currentCounter > 0">
    <span class="pa-0">{{displayCount(currentCounter)}}</span>
  </div>
</template>

<style scoped>
.counter__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #4CAF50;
  color: white;

  span{
    margin: auto auto !important;
    font-size: 11px;
    font-weight: bold;
  }
}

@media (max-width: 1100px) {
  .counter__wrapper:not(.__friends-tab) {
    position: absolute;
    right: 5px;
    top: 5px;
  }
}

@media (max-width: 650px) {
  .counter__wrapper:not(.__friends-tab) {
    width: 10px;
    height: 10px;
    background-color: orange;
    right: 5px;
    top: 2px;

    span {
      display: none;
    }
  }
}
</style>
