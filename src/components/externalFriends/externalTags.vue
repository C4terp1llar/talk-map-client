<script setup lang="ts">

import ScrollableContainer from "@/components/common/scrollableContainer.vue";
import TagsHomeSkeleton from "@/components/skeletons/tagsHomeSkeleton.vue";
import {useExternalUserStore} from "@/stores/externalUser";
import ExternalTagsList from "@/components/externalFriends/externalTagsList.vue";

const externalStore = useExternalUserStore()
</script>

<template>
  <div v-if="!externalStore.pending && externalStore.main?.tags && externalStore.main?.tags.length">
    <div class="tags-external-wrapper" v-if="externalStore.main?.tags && externalStore.main?.tags.length">
      <scrollable-container mode="tags" >
        <external-tags-list/>
      </scrollable-container>
    </div>
  </div>
  <div class="tags-external-wrapper" v-if="externalStore.pending">
    <tags-home-skeleton/>
  </div>
</template>

<style scoped lang="scss">
.tags-external-wrapper{
  padding: 10px;
  background: rgb(var(--v-theme-background));
  box-shadow: 0 0 10px currentColor;
  border-radius: 15px;
  display: flex;
  justify-content: center;
}
</style>