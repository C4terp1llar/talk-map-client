<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import {useCmStore} from "@/stores/cmStore";
import type {FullMessage} from "@/helpers/interfaces";

interface Props {
  message: FullMessage;
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

const changePending = ref<boolean>(false);
const handleChangeMessage = async () => {
  let files = null;
  changePending.value = true;
  if (props.message.mediaInfo.length) {
    files = await cmStore.getAttachedFiles(props.message.mediaInfo);
  }
  changePending.value = false;
  cmStore.changeMsgData = {
    attaches: files || [],
    message: props.message,
  }
  emit('close', props.mId)
};

const handleCopyMessage = async () => {
  if (props.message.content){
    await navigator.clipboard.writeText(props.message.content);
    emit('close', props.mId)
  }
};
</script>

<template>
  <div class="message-item__menu" ref="menuRef">
    <v-btn v-if="mode === 'internal'" prepend-icon="mdi-pen" class="text-none fz-12" density="compact" variant="tonal" @click="handleChangeMessage" :loading="changePending" :disabled="changePending || delPending">
      Изменить
    </v-btn>

    <v-btn prepend-icon="mdi-redo-variant" class="text-none fz-12" density="compact" variant="tonal">
      Ответить
    </v-btn>

    <v-btn v-if="mode === 'internal'" prepend-icon="mdi-delete-outline" class="text-none fz-12" density="compact" variant="tonal" @click="handleDeleteMessage" :loading="delPending" :disabled="delPending || changePending">
      Удалить
    </v-btn>

    <v-btn prepend-icon="mdi-content-copy" class="text-none fz-12" density="compact" variant="tonal" @click="handleCopyMessage" v-if="props.message.content">
      Копировать
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
.message-item__menu {
  border-radius: 10px;
  background: rgb(var(--v-theme-background));
  padding: 5px;
  gap: 5px;
  border: 1px solid grey;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
</style>
