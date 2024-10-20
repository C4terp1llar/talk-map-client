<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

interface Props {
  mode: 'tags' | 'filter'
}
const props = defineProps<Props>()

const contentRef = ref<HTMLElement | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);

const wrapperWidth = ref(0);
const contentWidth = ref(0);

const isContentFits = computed(() => {
  return wrapperWidth.value >= contentWidth.value;
});

const updateSizes = () => {
  if (wrapperRef.value && contentRef.value) {
    wrapperWidth.value = wrapperRef.value.clientWidth;
    contentWidth.value = contentRef.value.scrollWidth;
  }
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  updateSizes();

  resizeObserver = new ResizeObserver(updateSizes);
  if (wrapperRef.value && contentRef.value) {
    resizeObserver.observe(wrapperRef.value);
    resizeObserver.observe(contentRef.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

const scrollLeft = () => {
  const container = contentRef.value;
  if (container) {
    container.scrollBy({ left: -150, behavior: 'smooth' });
  }
};

const scrollRight = () => {
  const container = contentRef.value;
  if (container) {
    container.scrollBy({ left: 150, behavior: 'smooth' });
  }
};
</script>

<template>
  <div :class="['scrollable-wrapper', props.mode === 'filter' ? '__filter' : '', props.mode === 'tags' ? '__tags' : '']" ref="wrapperRef">
    <button @click="scrollLeft" class="h-100 mr-2" v-if="!isContentFits">
      <v-icon>mdi-chevron-left</v-icon>
    </button>

    <div class="scrollable-content" ref="contentRef">
      <slot></slot>
    </div>

    <button @click="scrollRight" class="h-100 ml-2" v-if="!isContentFits">
      <v-icon>mdi-chevron-right</v-icon>
    </button>
  </div>
</template>

<style scoped>
.scrollable-wrapper {
  display: grid;
  grid-template-columns: auto auto auto;
  align-items: center;
  justify-content: center;

  &.__tags{
    .scrollable-content{
      padding: 5px 10px;
      border-radius: 25px;
      filter: drop-shadow(0 0 1px currentColor);
    }
  }

  &.__filter{
    margin-bottom: 10px;
  }
}

.scrollable-content {
  position: relative;
  overflow-x: auto;
  white-space: nowrap;
  scroll-behavior: smooth;
  display: flex;

  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollable-content::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
}
</style>
