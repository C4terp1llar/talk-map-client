<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import {useCmStore} from "@/stores/cmStore";

interface Props {
  mId: string;
  convId: string;
  mode: 'internal' | 'external';
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "close", mId: string): void;
}>();

const menuRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    emit("close", props.mId);
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

const cmStore = useCmStore();

const delPending = ref<boolean>(false);
const handleDeleteMessage = async () => {
  delPending.value = true;
  await cmStore.deleteMessage(props.convId, props.mId);
  delPending.value = false;
  emit("close", props.mId);
  await cmStore.reloadMessagesAndDialogs()
}
</script>

<template>
  <div class="message-item__menu" ref="menuRef">
    <v-btn prepend-icon="mdi-redo-variant" class="text-none fz-12" density="compact" variant="tonal">
      Ответить
    </v-btn>

    <v-btn prepend-icon="mdi-pen" class="text-none fz-12" density="compact" variant="tonal">
      Изменить
    </v-btn>

    <v-btn prepend-icon="mdi-delete-outline" class="text-none fz-12" density="compact" variant="tonal" @click="handleDeleteMessage" :loading="delPending" :disabled="delPending">
      Удалить
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
.message-item__menu {
  border-radius: 10px;
  background: rgb(var(--v-theme-background));
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  border: 1px solid grey;
}
</style>
