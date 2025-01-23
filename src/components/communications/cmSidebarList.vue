<script setup lang="ts">

import {useCmStore} from "@/stores/cmStore";
import {onMounted, ref} from "vue";
import ConvItemSkeleton from "@/components/skeletons/convItemSkeleton.vue";
import CmSidebarListSearch from "@/components/communications/cmSidebarListSearch.vue";
import {debounce} from "perfect-debounce";

const cmStore = useCmStore()

const LIMIT = 30
const page = ref<number>(1);
const queryStr = ref<string>('')
const querySearchFlag = ref<boolean>(false)

const pending = ref<boolean>(false);
const qPending = ref<boolean>(false);
const morePending = ref<boolean>(false);

onMounted(async () => {
  await cmStore.getConversations(page.value, LIMIT)
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

const queryUpdate = async (val: string) => {
  queryStr.value = val;
  await debouncedOperation();
}
const debouncedOperation = debounce(async () => {
  qPending.value = true;
  await uploadData('load');
}, 500);

</script>

<template>
  <div class="cm-sidebar-list__wrapper">
    <cm-sidebar-list-search @update-query-value="value => queryUpdate(value)" :pending="qPending"/>

    <conv-item-skeleton class="mt-1 mb-1" v-for="i in 3" :key="i" v-if="pending"/>

    <div class="cm-sidebar-list__content" v-if="!pending && cmStore.conversations">
      <div class="cm-conversations-list__not-found" v-if="!cmStore.conversations.length">
        <span v-if="querySearchFlag">Ничего не нашлось 🔍</span>
        <span v-else>У вас нет диалогов. Напишите кому-нибудь ✏️</span>
      </div>
      <div class="cm-conversations-list" v-for="c in cmStore.conversations" :key="c._id" v-else>
        <!--
        сделать логику по которой групповой диалог передается в пропсах в компонент групповой а личный в личный

        -->
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cm-sidebar-list__wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px;

  .cm-sidebar-list__content {
    height: 100%;

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