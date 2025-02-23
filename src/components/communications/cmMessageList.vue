<script setup lang="ts">
import type {FullMessage, ShortUserInfo} from "@/helpers/interfaces";
import CreateMessage from "@/components/communications/createMessage.vue";
import CmMessageListHead from "@/components/communications/cmMessageListHead.vue";
import MessageItem from "@/components/communications/messageItem.vue";
import { nextTick, onMounted, ref, watch } from "vue";
import {formatCmDividerDate} from "@/helpers/dateHelper";
import MessageItemMenu from "@/components/communications/messageItemMenu.vue";

interface Props {
  messages?: FullMessage[];
  newConvMode?: boolean;
  newDialogOpponent?: ShortUserInfo
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
  if (!props.messages || !props.messages.length) return

  if (index === 0) {
    return true;
  }
  const currentDate = new Date(props.messages[index].createdAt).toDateString();
  const previousDate = new Date(props.messages[index - 1].createdAt).toDateString();
  return currentDate !== previousDate;
};

const selectedMessageItem = ref<FullMessage | null>(null);
const prevMId = ref<string | null>(null);


const handleVoidMessageMenu = (msg: FullMessage) => {
  if (prevMId.value && prevMId.value === msg._id){
    prevMId.value = null;
    handleCloseMenu()
    return;
  }
  prevMId.value = msg._id;

  if (selectedMessageItem.value) {
    const prevMessageElement = document.querySelector(`[data-message-id="${selectedMessageItem.value._id}"]`);
    if (prevMessageElement) {
      prevMessageElement.classList.remove('no_blurred__message');
    }
  }

  selectedMessageItem.value = msg;
  const messageElement = document.querySelector(`[data-message-id="${msg._id}"]`);
  if (messageElement) {
    messageElement.classList.add('no_blurred__message');
  }
};

const handleCloseMenu = () => {
  if (selectedMessageItem.value) {
    const messageElement = document.querySelector(`[data-message-id="${selectedMessageItem.value._id}"]`);
    if (messageElement) {
      messageElement.classList.remove('no_blurred__message');
    }
  }
  selectedMessageItem.value = null;
};
</script>

<template>
  <div class="cm-message-list__wrapper">
    <div class="blur-overlay" v-if="selectedMessageItem"></div>

    <div class="cm-message-list__head-wrap">
      <cm-message-list-head :new-conv-mode="newConvMode" :new-dialog-opponent="newDialogOpponent"/>
      <v-scroll-y-transition>
        <div class="message-item-menu__wrapper" v-if="selectedMessageItem">
          <message-item-menu :mode="selectedMessageItem.mode" :conv-id="selectedMessageItem.conversation_id" :m-id="selectedMessageItem._id" @close="handleCloseMenu"/>
        </div>
      </v-scroll-y-transition>
    </div>

    <div :class="['cm-message-list__content styled-scroll__cm', {'show-blur': selectedMessageItem}]" ref="messageListRef" v-if="!newConvMode" @contextmenu.prevent>
      <template v-for="(message, index) in props.messages" :key="message._id">
        <div v-if="shouldShowDateDivider(index)" class="msg__date-divider">
          <div class="date-divider__content">
            <span>{{ formatCmDividerDate(message.createdAt) }}</span>
          </div>
        </div>

        <message-item @void-message-menu="msg => handleVoidMessageMenu(msg)" :m="message" />
      </template>
    </div>
    <div class="cm-message-list__content __new_dialog" v-else>
       <span>Сообщений пока нет</span>
    </div>

    <div class="cm-message-list__create-msg-wrap">
      <create-message :new-dialog-opponent="newDialogOpponent" :new-conv-mode="newConvMode"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.message-item-menu__wrapper {
  z-index: 10;
  position: absolute;
  top: calc(100% + 5px);
  width: calc(100% - 5px);
}

.cm-message-list__wrapper {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  position: relative;

  .blur-overlay{
    backdrop-filter: blur(4px);
    inset: 0;
    z-index: 1;
    position: absolute;
  }

  .cm-message-list__head-wrap,
  .cm-message-list__content,
  .cm-message-list__create-msg-wrap {
    grid-row: span 1;
  }

  .cm-message-list__head-wrap,
  .cm-message-list__create-msg-wrap {
    margin: 5px;
  }
  .cm-message-list__head-wrap{
    position: relative;
  }
}

.cm-message-list__content {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 5px;
  position: relative;
  transition: .3s;

  &.show-blur{
    transition: outline-color, .3s;
    overflow-y: hidden;
  }

  &.__new_dialog{
    justify-content: center;
    align-items: center;
    span{
      font-style: italic;
    }
  }
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
