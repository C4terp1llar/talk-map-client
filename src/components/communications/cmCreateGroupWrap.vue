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
      <small>Создать группу</small>
    </button>
  </div>
  <cm-create-group v-if="isCreateMenuVisible" @close="isCreateMenuVisible = !isCreateMenuVisible"/>
</template>

<style scoped lang="scss">
.create-group__wrap{
  width: 100%;
  margin-bottom: 5px;
}
.create-group__btn{
  padding: 0 5px;
  transition: .3s;
  width: 100%;
  border: 1px solid gray;
  border-radius: 15px 15px 5px 5px;

  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;

  small{
    font-weight: 500;
  }

  &:hover{
    box-shadow: 0 0 2px currentColor;
  }
}
</style>