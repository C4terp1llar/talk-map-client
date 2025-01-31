<script setup lang="ts">
import type {FullMessage, PersonalConv} from "@/helpers/interfaces";
import CreateMessage from "@/components/communications/createMessage.vue";
import CmMessageListHead from "@/components/communications/cmMessageListHead.vue";
import MessageItem from "@/components/communications/messageItem.vue";

interface Props {
  messages: FullMessage[]
}

const props = defineProps<Props>()
</script>

<template>
  <div class="cm-message-list__wrapper">

    <div class="cm-message-list__head-wrap">
      <cm-message-list-head/>
    </div>

    <div class="cm-message-list__content styled-scroll__np">
      <message-item v-for="m in messages" :key="m._id" :m="m"/>
    </div>

    <div class="cm-message-list__create-msg-wrap">
      <create-message/>
    </div>

  </div>
</template>

<style scoped lang="scss">
.cm-message-list__wrapper{
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;

  .cm-message-list__head-wrap,
  .cm-message-list__content,
  .cm-message-list__create-msg-wrap{
    grid-row: span 1;
  }
}

.cm-message-list__content{
  display: flex;
  flex-direction: column;
}
</style>