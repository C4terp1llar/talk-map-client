<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, withDefaults } from 'vue';

interface Props {
  mode: 'tags' | 'filter';
  useResizeObserver?: boolean;
  useScrollBar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  useResizeObserver: true,
});

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

  if (props.useResizeObserver) {
    resizeObserver = new ResizeObserver(updateSizes);
    if (wrapperRef.value && contentRef.value) {
      resizeObserver.observe(wrapperRef.value);
      resizeObserver.observe(contentRef.value);
    }
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

let scroll = props.useScrollBar ? 220 : 150;

const scrollLeft = () => {
  const container = contentRef.value;
  if (container) {
    container.scrollBy({ left: -scroll, behavior: 'smooth' });
  }
};

const scrollRight = () => {
  const container = contentRef.value;
  if (container) {
    container.scrollBy({ left: scroll, behavior: 'smooth' });
  }
};
</script>

<template>
  <div :class="['scrollable-wrapper', props.mode === 'filter' ? '__filter' : '', props.mode === 'tags' ? '__tags' : '']" ref="wrapperRef">
    <button @click="scrollLeft" class="h-100 mr-2" v-if="!isContentFits || !props.useResizeObserver">
      <v-icon>mdi-chevron-left</v-icon>
    </button>

    <div :class="['scrollable-content', props.useScrollBar ? '__scroll-bar' : '']" ref="contentRef">
      <slot></slot>
    </div>

    <button @click="scrollRight" class="h-100 ml-2" v-if="!isContentFits || !props.useResizeObserver">
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

  -ms-overflow-style: none;
  scrollbar-width: none;
  &.__scroll-bar{
    -ms-overflow-style: auto !important;
    scrollbar-width: auto!important;
  }
  &.__scroll-bar::-webkit-scrollbar {
    width: 8px; /* Ширина скроллбара */
    margin-right: 5px;
  }

  &.__scroll-bar::-webkit-scrollbar-thumb {
    background-color: #c4c4c4;
    border-radius: 15px;
  }

  &.__scroll-bar::-webkit-scrollbar-track {
    margin: 10px;
    background: #777777;
    border-radius: 15px;
  }
}
.__scroll-bar{
  -ms-overflow-style: auto !important;
  scrollbar-width: auto!important;
}
.__scroll-bar::-webkit-scrollbar {
  width: 8px; /* Ширина скроллбара */
  margin-right: 5px;
}

.__scroll-bar::-webkit-scrollbar-thumb {
  background-color: #c4c4c4;
  border-radius: 15px;
}

.__scroll-bar::-webkit-scrollbar-track {
  margin: 10px;
  background: #777777;
  border-radius: 15px;
}

.scrollable-content::-webkit-scrollbar {
  display: none;
}
</style>