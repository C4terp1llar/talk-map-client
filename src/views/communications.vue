<script setup lang="ts">
import CmSidebar from "@/components/communications/cmSidebar.vue";
import CmMainContent from "@/components/communications/cmMainContent.vue";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const windowWidth = ref<number>(window.innerWidth);

const szDialogs = computed(() => {
  return windowWidth.value <= 950 && route.query.conv;
});

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", updateWindowWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWindowWidth);
});
</script>

<template>
  <div class="communications__wrapper">
    <cm-sidebar v-if="windowWidth <= 950 ? !szDialogs : true" />
    <cm-main-content v-if="windowWidth <= 950 ? szDialogs : true" />
  </div>
</template>

<style scoped lang="scss">
.communications__wrapper {
  width: 100%;
  height: calc(100vh - 110px);
  display: grid;
  gap: 10px;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr;

  @media (max-width: 1500px) {
    grid-template-columns: 275px 1fr;
  }

  @media (max-width: 950px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 650px) {
    height: calc(100vh - 170px);
  }
}
</style>
