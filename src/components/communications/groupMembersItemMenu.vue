<script setup lang="ts">
import type {ConvMemberInfo} from "@/helpers/interfaces";
import {ref} from "vue";
import {onClickOutside} from "@vueuse/core";
import {useCmStore} from "@/stores/cmStore";

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'reload'): void,
}>()

interface Props {
  member: ConvMemberInfo,
  mode: 'me' | 'other',
  senderRole: 'owner' | 'admin' | 'member';
  convId: string;
}

const props = defineProps<Props>()

const menuRef = ref<HTMLElement | null>(null);
const clickOutside = () => {
  emit('close')
};
onClickOutside(menuRef, e => clickOutside());

const cmStore = useCmStore();

const disableFlag = ref<boolean>(false);
const pending = ref<string>('');

const handleChangeRole = async (newRole: 'owner' | 'admin' | 'member', pendString: string) => {
  start(pendString);
  await cmStore.changeMemberRole(props.convId, props.member._id, newRole);
  await end()
}

const handleKickMember = async (pendString: string) => {
  start(pendString);
  await cmStore.kickGroupMember(props.convId, props.member._id);
  await end()
}

const start = (pendString: string) => {
  disableFlag.value = true;
  pending.value = `${pendString}&${props.member._id}`;
}
const end = async () => {
  emit('reload')
  emit('close')
  await cmStore.reloadMessagesAndDialogs();
  disableFlag.value = false;
}
</script>

<template>
  <div class="cm-group-members-item__menu" ref="menuRef">

    <v-btn class="text-none" density="comfortable" variant="outlined" color="warning" :disabled="disableFlag"
           v-if="member.role === 'member' && senderRole === 'owner' && mode === 'other'"
           @click="handleChangeRole('admin', 'make_admin')" :loading="pending === `make_admin&${member._id}`"
    >
      Сделать админом
    </v-btn>

    <v-btn class="text-none" density="comfortable" variant="outlined" color="warning" :disabled="disableFlag"
           v-if="member.role === 'admin' && senderRole === 'owner' && mode === 'other'"
           @click="handleChangeRole('member','delete_admin')" :loading="pending === `delete_admin&${member._id}`"
    >
      Убрать админа
    </v-btn>

    <v-btn class="text-none" density="comfortable" variant="outlined" color="danger" :disabled="disableFlag"
           v-if="(member.role === 'member' && senderRole === 'admin' && mode === 'other') || ((member.role === 'member' || member.role === 'admin') && senderRole === 'owner' && mode === 'other')"
           :loading="pending === `kick_member&${member._id}`" @click="handleKickMember('kick_member')"
    >
      Исключить
    </v-btn>

    <v-btn class="text-none" density="comfortable" variant="outlined" v-if="mode === 'me'" :disabled="disableFlag" :loading="pending === `out_group&${member._id}`" color="danger">Выйти</v-btn>
  </div>
</template>

<style scoped lang="scss">
.cm-group-members-item__menu {
  border-radius: 10px;
  box-shadow: 0 0 5px currentColor;
  background: rgb(var(--v-theme-background));
  padding: 8px;
  display: flex;
  flex-direction: column;
  width: 200px;
  gap: 5px;
}
</style>