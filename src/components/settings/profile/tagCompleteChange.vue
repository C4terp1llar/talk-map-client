<script setup lang="ts">

import TagList from "@/components/settings/profile/tagList.vue";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()
</script>

<template>
<div class="tag-complete-change-wrapper mt-2" v-if="userStore.mainUserInfo?.tags && userStore.mainUserInfo?.tags.length">
  <span class="fw-bold">Ваши теги:</span>

  <v-dialog-transition>
    <tag-list :is-preview="true" class="mt-2"/>
  </v-dialog-transition>

</div>
</template>

<style scoped lang="scss">
.tag-complete-change-wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>