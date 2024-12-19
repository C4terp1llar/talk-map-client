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

    <div class="position-relative mb-2">
      <text-divider text="smth"/>
      <skeleton-loader/>
    </div>

    <div class="short-friends__items mb-1">
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
  height:  fit-content;
  width: 100%;
  box-shadow: 0 1px 10px currentColor;
  border-radius: 15px;
  padding: 10px;
  background: rgb(var(--v-theme-background));

  .short-friends__items {
    display: flex;
    gap: 3px;
    justify-content: center;
    flex-wrap: nowrap;
    width: fit-content;
    margin: auto;

    @media screen and (max-width: 550px){
      flex-wrap: wrap;

    }
  }
}
</style>