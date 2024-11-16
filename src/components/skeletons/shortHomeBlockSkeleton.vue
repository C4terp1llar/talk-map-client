<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import MutalItemSkeleton from "@/components/skeletons/mutalItemSkeleton.vue";
import TextDivider from "@/components/common/textDivider.vue";

interface Props {
  isShort?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <div class="short-friends__wrapper">
    <div class="position-relative">
      <text-divider text="smth"/>
      <skeleton-loader/>
    </div>

    <div class="short-friends__items">
      <mutal-item-skeleton :is-short="props.isShort" v-for="i in 3" :key="i"/>
    </div>

  </div>
</template>

<style scoped lang="scss">
.__no-friends {
  padding: 10px 15px;
  gap: 5px;
}

.short-friends__wrapper {
  overflow: hidden;
  width: fit-content;
  box-shadow: 0 1px 10px currentColor;
  border-radius: 15px;
  padding: 10px;
  background: rgb(var(--v-theme-background));
  position: relative;

  @media screen and (max-width: 450px) {
    width: 100%;
  }

  .short-friends__items {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>