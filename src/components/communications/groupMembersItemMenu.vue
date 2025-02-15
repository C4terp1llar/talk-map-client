<script setup lang="ts">
import type {ConvMemberInfo} from "@/helpers/interfaces";
import {ref} from "vue";
import {onClickOutside} from "@vueuse/core";

const emit = defineEmits<{
  (e: 'close'): void
}>()

interface Props {
  member: ConvMemberInfo,
  mode: 'me' | 'other',
  senderRole: 'owner' | 'admin' | 'member';
}

const props = defineProps<Props>()

const menuRef = ref<HTMLElement | null>(null);
const isPostMenuVisible = ref(false);
const clickOutside = () => {
  setTimeout(() => {isPostMenuVisible.value = false})
};
onClickOutside(menuRef, e => clickOutside());
</script>

<template>
  <div class="cm-group-members-item__menu" ref="menuRef">

  </div>
</template>

<style scoped lang="scss">
.cm-group-members-item__menu{

}
</style>