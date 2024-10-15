<script setup lang="ts">

import TagPreview from "@/components/settings/profile/tagPreview.vue";
import TagMake from "@/components/settings/profile/tagMake.vue";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()
</script>

<template>
  <div class="tag-complete-wrapper">
    <v-dialog-transition>
      <tag-preview v-if="userStore.newTagEmoji || userStore.newTagText" class="align-self-center mb-2"/>
    </v-dialog-transition>

    <tag-make/>
  </div>
</template>

<style scoped lang="scss">
.tag-complete-wrapper{
  display: flex;
  flex-direction: column;
}
</style>