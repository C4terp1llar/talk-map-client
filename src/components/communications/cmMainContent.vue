<script setup lang="ts">
import CreateMessage from "@/components/communications/createMessage.vue";
import CmCreateGroupWrap from "@/components/communications/cmCreateGroupWrap.vue";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {useCmStore} from "@/stores/cmStore";
import CmMessageListHead from "@/components/communications/cmMessageListHead.vue";
import CmMessageList from "@/components/communications/cmMessageList.vue";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import NotFoundTemplate from "@/components/notFoundTemplate.vue";
import DialogNotFound from "@/components/communications/dialogNotFound.vue";

const route = useRoute();
const cmStore = useCmStore();

const page = ref<number>(1);
const LIMIT = 200;

onUnmounted(() => {
  page.value = 1;
  cmStore.unmountMsgClear();
})

onMounted(async () => {
  if (!cmStore.newPersonalConvOpponentUid){
    if (route.query.conv){
      await Promise.all([
        uploadData(route.query.conv.toString()),
        uploadDialogInfo(route.query.conv.toString())
      ])
    }
    watch(
        () => route.query.conv,
        async (newConvId, oldConvId) => {
          if (newConvId !== oldConvId && newConvId) {
            await Promise.all([
              uploadData(newConvId.toString()),
              uploadDialogInfo(newConvId.toString())
            ])
          }
        }
    );
  }
})

const uploadData = async (convId: string) => {
  await cmStore.getMessages(convId, page.value, LIMIT)
}

const uploadDialogInfo = async (convId: string) => {
  await cmStore.getDialogInfo(convId)
}

</script>

<template>
  <div class="cm-main-content__wrapper" v-if="!cmStore.newPersonalConvOpponentUid">
    <div class="cm-main-content" v-if="route.query.conv">
      <lazy-placeholder-loader v-if="cmStore.getDialogPend || cmStore.messagesPend"/>

      <cm-message-list v-if="cmStore.messages && (!cmStore.getDialogPend && !cmStore.messagesPend)" :messages="cmStore.messages"/>

      <dialog-not-found class="__not-found" v-if="!cmStore.messages && !cmStore.getDialogPend && !cmStore.messagesPend"/>
    </div>
    <div class="cm-main-content__choose" v-if="!route.query.conv && !cmStore.compositeDialogPend">
      <h6 class="ma-0">Выберите нужный диалог 💬</h6>
    </div>
  </div>
  <div class="cm-main-content__wrapper" v-else>
    новый перс диалог
  </div>
</template>

<style scoped lang="scss">
.cm-main-content__wrapper {
  height: 100%;
  width: 100%;
  border: 1px solid gray;
  border-radius: 15px;
  background: rgb(var(--v-theme-background));
  overflow: hidden;

  .cm-main-content{
    height: 100%;
    width: 100%;

    .__not-found {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .cm-main-content__choose{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>