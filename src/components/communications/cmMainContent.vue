<script setup lang="ts">
import CreateMessage from "@/components/communications/createMessage.vue";
import CmCreateGroupWrap from "@/components/communications/cmCreateGroupWrap.vue";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {useCmStore} from "@/stores/cmStore";
import CmMessageListHead from "@/components/communications/cmMessageListHead.vue";
import CmMessageList from "@/components/communications/cmMessageList.vue";

const route = useRoute();
const cmStore = useCmStore();

const page = ref<number>(1);
const LIMIT = 200;

onUnmounted(() => {
  page.value = 1;
  cmStore.unmountMsgClear();
})

onMounted(async () => {
  if (route.query.conv){
    await uploadData(route.query.conv.toString())
  }
  watch(
      () => route.query.conv,
      async (newConvId, oldConvId) => {
        if (newConvId !== oldConvId && newConvId) {
          await uploadData(newConvId.toString())
        }
      }
  );
})

const uploadData = async (convId: string) => {
  await cmStore.getMessages(convId, page.value, LIMIT)
}

</script>

<template>
  <div class="cm-main-content__wrapper">
    <cm-message-list-head/>
    <cm-message-list v-if="cmStore.messages && cmStore.messages.length" :messages="cmStore.messages"/>
  </div>
</template>

<style scoped lang="scss">
.cm-main-content__wrapper {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 10px;

  box-shadow: 0 1px 10px currentColor;
  border-radius: 15px;
  background: rgb(var(--v-theme-background));
  padding: 5px;
}
</style>