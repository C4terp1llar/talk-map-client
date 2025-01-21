<script setup lang="ts">
import {ref} from "vue";
import CmCreateGroup from "@/components/communications/cmCreateGroup.vue";

const isCreateMenuVisible = ref<boolean>(false);
</script>

<template>
  <div class="create-group__wrap">
    <v-btn class="text-none" @click="isCreateMenuVisible = !isCreateMenuVisible">Создать группу</v-btn>
  </div>
  <cm-create-group v-if="isCreateMenuVisible" @close="isCreateMenuVisible = !isCreateMenuVisible"/>
</template>

<style scoped lang="scss">

</style>