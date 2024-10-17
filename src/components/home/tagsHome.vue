<script setup lang="ts">

import ScrollableContainer from "@/components/common/scrollableContainer.vue";
import TagList from "@/components/settings/profile/tagList.vue";
import {useUserStore} from "@/stores/user";
import TagsHomeSkeleton from "@/components/skeletons/tagsHomeSkeleton.vue";
import TagMakeCover from "@/components/home/tagMakeCover.vue";

const userStore = useUserStore();

</script>

<template>
  <div class="tags-home-wrapper" v-if="!userStore.pending">
    <scrollable-container v-if="userStore.mainUserInfo?.tags && userStore.mainUserInfo?.tags.length">
      <tag-list :is-preview="false"/>
    </scrollable-container>

    <tag-make-cover v-else/>

  </div>
  <div class="tags-home-wrapper" v-else>
    <tags-home-skeleton/>
  </div>
</template>

<style scoped lang="scss">
.tags-home-wrapper{
  padding: 10px;
  background: rgb(var(--v-theme-background));
  box-shadow: 0 0 10px currentColor;
  border-radius: 15px;
  display: flex;
  justify-content: center;
}
</style>