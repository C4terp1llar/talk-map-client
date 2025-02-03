<script setup lang="ts">
import type { FullMessage } from "@/helpers/interfaces";
import CreateMessage from "@/components/communications/createMessage.vue";
import CmMessageListHead from "@/components/communications/cmMessageListHead.vue";
import MessageItem from "@/components/communications/messageItem.vue";
import { nextTick, onMounted, ref, watch } from "vue";
import {formatCmDividerDate} from "@/helpers/dateHelper";

interface Props {
  messages: FullMessage[];
}

const props = defineProps<Props>();

const messageListRef = ref<HTMLElement | null>(null);
const isAtBottom = ref(true);

const scrollToBottom = (smooth = false) => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTo({
        top: messageListRef.value.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  });
};

const checkScrollPosition = () => {
  if (!messageListRef.value) return;
  const { scrollTop, scrollHeight, clientHeight } = messageListRef.value;
  isAtBottom.value = scrollHeight - scrollTop - clientHeight < 20;
};

onMounted(() => {
  if (!messageListRef.value) return;

  const observer = new MutationObserver(() => {
    if (isAtBottom.value) {
      scrollToBottom(false);
    }
  });

  observer.observe(messageListRef.value, { childList: true, subtree: true });

  scrollToBottom();

  messageListRef.value.addEventListener("scroll", checkScrollPosition);
});

const shouldShowDateDivider = (index: number) => {
  if (index === 0) {
    return true;
  }
  const currentDate = new Date(props.messages[index].createdAt).toDateString();
  const previousDate = new Date(props.messages[index - 1].createdAt).toDateString();
  return currentDate !== previousDate;
};
</script>

<template>
  <div class="cm-message-list__wrapper">
    <div class="cm-message-list__head-wrap">
      <cm-message-list-head />
    </div>

    <div class="cm-message-list__content styled-scroll__cm" ref="messageListRef">
      <template v-for="(message, index) in props.messages" :key="message._id">
        <div v-if="shouldShowDateDivider(index)" class="msg__date-divider">
          <div class="date-divider__content">
            <span>{{ formatCmDividerDate(message.createdAt) }}</span>
          </div>
        </div>

        <message-item :m="message" />
      </template>
    </div>

    <div class="cm-message-list__create-msg-wrap">
      <create-message />
    </div>
  </div>
</template>

<style scoped lang="scss">
.cm-message-list__wrapper {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;

  .cm-message-list__head-wrap,
  .cm-message-list__content,
  .cm-message-list__create-msg-wrap {
    grid-row: span 1;
  }

  .cm-message-list__head-wrap,
  .cm-message-list__create-msg-wrap {
    margin: 5px;
  }
}

.cm-message-list__content {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 5px;
}

.msg__date-divider{
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 5px 0;
  .date-divider__content{
    padding: 3px 8px;
    border-radius: 15px;
    background: #7777;
    span{
      font-size: 14px;
    }
  }
}
</style>
