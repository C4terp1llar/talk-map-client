<script setup lang="ts">

import {useCmStore} from "@/stores/cmStore";
import {onMounted, ref} from "vue";
import ConvItemSkeleton from "@/components/skeletons/convItemSkeleton.vue";
import CmSidebarListSearch from "@/components/communications/cmSidebarListSearch.vue";
import {debounce} from "perfect-debounce";
import CmPersonalConversationItem from "@/components/communications/cmPersonalConversationItem.vue";
import CmGroupConversationItem from "@/components/communications/cmGroupConversationItem.vue";
import type {GroupConv, PersonalConv} from "@/helpers/interfaces";
import TextDivider from "@/components/common/textDivider.vue";
import {useRouter} from "vue-router";

const router = useRouter();
const cmStore = useCmStore()

const LIMIT = 30
const page = ref<number>(1);
const queryStr = ref<string>('')
const querySearchFlag = ref<boolean>(false)

const pending = ref<boolean>(false);
const qPending = ref<boolean>(false);
const morePending = ref<boolean>(false);

onMounted(async () => {
  await uploadData('load')
})

const uploadData = async (mode: 'load' | 'load-more') => {
  let crPage = mode === 'load' ? page.value : page.value + 1;
  const crPending = mode === 'load' ? pending : morePending;

  querySearchFlag.value = !!queryStr.value.length

  if (!qPending.value) crPending.value = true;

  await cmStore.getConversations(crPage, LIMIT, queryStr.value)
  crPending.value = false;
  qPending.value = false;

}

const debouncedOperation = debounce(async () => {
  if (queryStr.value){
    qPending.value = true;
  }
  await uploadData('load');
}, 500);


function isGroupConv(conv: any): conv is GroupConv {
  return 'owner_id' in conv;
}

const handleSelectDialog = async () => {
  if (queryStr.value){
    queryStr.value = "";
    await uploadData('load')
  }
}

const handleSelectWithoutDialog = async (uid: string) => {
  await router.push({query: {nConv: uid}})
  cmStore.selectedDialogId = null;
  cmStore.newPersonalConvOpponentUid = uid;
  await handleSelectDialog()
}
</script>

<template>
  <div class="cm-sidebar-list__wrapper">
    <cm-sidebar-list-search @update:modelValue="debouncedOperation" v-model="queryStr" :pending="qPending" />

    <conv-item-skeleton class="mt-1 mb-1" v-for="i in 3" :key="i" v-if="pending"/>

    <div class="cm-sidebar-list__content" v-if="!pending && cmStore.conversations">

      <div class="cm-conversations-list__not-found" v-if="!cmStore.conversations.length && (!cmStore.withoutConversations || (cmStore.withoutConversations && !cmStore.withoutConversations.length))">
        <span v-if="querySearchFlag">Ничего не нашлось 🔍</span>
        <span v-else>У вас нет диалогов. Напишите кому-нибудь ✏️</span>
      </div>

      <div class="cm-conversations-list" v-else>
        <component
            @selectDialog="handleSelectDialog"
            v-for="c in cmStore.conversations"
            :key="c._id"
            :is="isGroupConv(c) ? CmGroupConversationItem : CmPersonalConversationItem"
            v-bind="isGroupConv(c) ? { conv: c as GroupConv } : { conv: c as PersonalConv }"
        />

        <cm-personal-conversation-item
            v-if="cmStore.withoutConversations && cmStore.withoutConversations.length"
            v-for="c in cmStore.withoutConversations"
            :key="c._id"
            :without-dialogs="c"
            :without-dialogs-mode="true"
            @select-without-dialog="val => handleSelectWithoutDialog(val)"
        />

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cm-sidebar-list__wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;

  .cm-sidebar-list__content {
    height: 100%;

    .cm-conversations-list{
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-top: 5px;
    }

    .cm-conversations-list__not-found {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  }
}
</style>