<script setup lang="ts">
import {useCmStore} from "@/stores/cmStore";
import CmCreateGroupMembers from "@/components/communications/cmCreateGroupMembers.vue";
import {onUnmounted, ref} from "vue";

interface Props {
  convId: string,
}

const props = defineProps<Props>()

const cmStore = useCmStore();

const newGroupMembers = ref<string[]>([]);
const membersErrors = ref<string[]>([]);

const handleUpdateMembers = (m: string[]) => {
  newGroupMembers.value = m;
  membersErrors.value = []
}

const handleAddMembers = async () => {
  if (newGroupMembers.value && newGroupMembers.value.length < 1){
    membersErrors.value.push('Добавьте хотя бы одного участника')
    return
  }

  await cmStore.addNewMembers(props.convId, newGroupMembers.value)
  cmStore.addMembersFlag = false
  await cmStore.reloadMessagesAndDialogs()
}

onUnmounted(() => cmStore.addMembersFlag = false);
</script>

<template>
  <div class="add-members__wrapper">
    <button @click="cmStore.addMembersFlag = false" class="close__btn">
      <v-icon class="desktop_icon" :size="24">mdi-close</v-icon>
      <div class="mobile_icon">
        <v-icon :size="24" color="green">mdi-arrow-left-bold-outline</v-icon>
        <span>Назад</span>
      </div>
    </button>

    <h5 class="text-center mt-2">Добавить участников</h5>

    <cm-create-group-members :errors="membersErrors" @select-member-update="members => handleUpdateMembers(members)" :conv-id="convId" add-new-members/>

    <div class="__controls">
      <v-btn class="mt-auto text-none w-100" rounded @click="handleAddMembers" :loading="cmStore.addMembersPend" :disabled="cmStore.addMembersPend">Готово</v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.add-members__wrapper {
  height: 100%;
  width: 100%;
  position: relative;

  .__controls{
    padding: 5px;
    position: sticky;
    bottom: 0;
    z-index: 5;
    background: rgb(var(--v-theme-background));
    border-radius: 10px;
  }
}

.close__btn {
  position: absolute;
  top: 5px;
  right: 5px;
  opacity: .7;
  transition: 0.3s;
  display: flex;
  align-items: center;
  z-index: 5;

  @media (max-width: 650px) {
    position: relative;
    width: 100%;
    display: block;
    padding: 5px;
    top: unset;
    right: unset;
    .desktop_icon {
      display: none;
    }
    .mobile_icon {
      display: flex !important;
    }
  }

  .mobile_icon {
    display: none;
    align-items: center;
    justify-content: space-between;
  }

  &:hover {
    opacity: 1;
  }
}
</style>