<script setup lang="ts">
import {ref} from "vue";
import CmCreateGroup from "@/components/communications/cmCreateGroup.vue";
import {useCmStore} from "@/stores/cmStore";

const cmStore = useCmStore();
const isCreateMenuVisible = ref<boolean>(false);
</script>

<template>
  <div class="create-group__wrap">
    <button :class="['create-group__btn', {'blinking__pending': cmStore.createGroupPending}]" @click="isCreateMenuVisible = !isCreateMenuVisible">
      <v-icon>mdi-account-multiple-plus-outline</v-icon>
    </button>
  </div>
  <cm-create-group v-if="isCreateMenuVisible" @close="isCreateMenuVisible = !isCreateMenuVisible"/>
</template>

<style scoped lang="scss">
.create-group__btn{
  padding: 0 5px;
  transition: .3s;

  &:hover{
    filter: drop-shadow(0 0 5px currentColor);
  }
}
</style>