<script setup lang="ts">
import type {FullMessage} from "@/helpers/interfaces";
import {getMsgContent} from "../../helpers/cmHelpers";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import MessageItemMedia from "@/components/communications/messageItemMedia.vue";
import {computed, ref} from "vue";
import {format} from "date-fns";
import MessageItemMenu from "@/components/communications/messageItemMenu.vue";
import {useCmStore} from "@/stores/cmStore";

const emit = defineEmits<{
  (e: "voidMessageMenu", m: FullMessage): void;
  (e: "voidResponseMessage", m: FullMessage): void;
}>();


interface Props {
  m: FullMessage
}

const props = defineProps<Props>()

const crSendTime = computed(() => {
  return format(new Date(props.m.createdAt), 'HH:mm');
});

const cmStore = useCmStore()
const declineChange = () => {
  cmStore.changeMsgData = null
  cmStore.changeMsgMedia = null
}
</script>

<template>
  <div :class="['message-item__wrapper minimalistic_scroll']" :data-message-id="m._id">

    <div class="message-item__change-head">
      <v-icon :size="20">mdi-pen</v-icon>
      <span>Редактирование</span>
      <v-btn @click="declineChange" class="ml-auto" variant="tonal" icon density="compact"><v-icon>mdi-close</v-icon></v-btn>
    </div>

    <div
        class="message-item__content"
    >
        <span
            v-if="m.conversationType === 'GroupConversation' && m.mode === 'external'"
            :style="{color: m.sender.nickname_color ? m.sender.nickname_color : 'currentColor'}"
            class="nickname-text"
        >
          {{ m.sender.nickname }}
        </span>

      <div class="msg-text__wrapper ">
          <span class="msg-text message__text-content" v-if="m.content || m.mediaInfo.length">
            <span v-if="m.mediaInfo.length" class="text-green mr-2">{{ m.mediaInfo.length === 1 ? m.mediaInfo[0].name : m.mediaInfo.length + `${m.mediaInfo.length <= 4 ? ' файла' : ' файлов'}` }}</span>
            <span v-if="m.content">{{ m.content }}</span>
          </span>

        <div class="msg-send__detail">
          <span class="msg-send___detail_time">{{ crSendTime }}</span>
          <div class="msg-send___detail_read-status" v-if="m.mode === 'internal'">
            <v-icon :size="12" color="green">{{ m.isRead ? 'mdi-check-all' : 'mdi-check' }}</v-icon>
          </div>
        </div>
      </div>

    </div>

  </div>

</template>

<style scoped lang="scss">
.message-item__change-head{
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: 14px;
  color: darkorange;
}

.message__text-content {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
}


.message-item__wrapper {
  border: 1px solid grey;
  border-radius: 10px;
  padding: 3px;
  margin: 0 5px;
}

.message-item__content {
  position: relative;
  display: flex;
  flex-direction: column;
  .msg-send__detail {
    height: 17px;
    display: flex;
    gap: 3px;
    align-items: center;
    flex-wrap: wrap;
    margin-left: auto;
    margin-top: auto;
    padding-left: 10px;

    .msg-send___detail_time {
      font-size: 11px;
      opacity: .7;
    }
  }

  .msg-text__wrapper {
    display: flex;
    flex-wrap: wrap;
    margin-left: 5px;
  }
}


.msg-text {
  font-size: 14px;
}

.nickname-text {
  font-weight: 500;
}
</style>