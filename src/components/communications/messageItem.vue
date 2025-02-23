<script setup lang="ts">
import type {FullMessage} from "@/helpers/interfaces";
import {getMsgContent} from "../../helpers/cmHelpers";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import MessageItemMedia from "@/components/communications/messageItemMedia.vue";
import {computed, ref} from "vue";
import {format} from "date-fns";
import MessageItemMenu from "@/components/communications/messageItemMenu.vue";

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

const getNewCoverUrl = () => {
  if (props.m.messageType === "system" && props.m.content === "change_cover" && props.m.additionalInfo) {
    return props.m.additionalInfo.split("^&^")[1];
  }
};


const handleContextMenu = (event: Event) => {
  event.preventDefault();
  emit('voidMessageMenu', props.m)
};

const handleSendResponse = (event: Event) => {
  event.preventDefault();
  emit('voidResponseMessage', props.m)
};

</script>

<template>
  <div :class="['message-item__wrapper mt-1 mb-1']" :data-message-id="m._id">

    <div class="message-item__system" v-if="m.messageType === 'system'">
      <div class="message-item__system-content">
        <span class="msg-text">{{ getMsgContent(m) }}</span>
      </div>
      <v-avatar :size="50" class="new_avatar mt-2"
                v-if="m.messageType === 'system' && props.m.content === 'change_cover'">
        <v-img
            :src="getNewCoverUrl()"
            alt="new cover"
            cover
        >
          <template v-slot:placeholder>
            <skeleton-loader/>
          </template>
        </v-img>
      </v-avatar>
    </div>

    <div :class="['message-item__default', m.mode]" v-else>

      <div class="message-item__avatar" v-if="m.conversationType === 'GroupConversation' && m.mode === 'external'">
        <v-avatar :size="30">
          <v-img
              :src="m.sender.avatar"
              alt="sender avatar"
              cover
          >
            <template v-slot:placeholder>
              <skeleton-loader/>
            </template>
          </v-img>
        </v-avatar>
      </div>

      <!--      хендлер на нажатие пкм или холд при таче    -->
      <div
          class="message-item__content"
          @contextmenu="handleContextMenu"
          @touchstart="handleContextMenu"
          @dblclick="handleSendResponse"
      >

        <span
            v-if="m.conversationType === 'GroupConversation' && m.mode === 'external'"
            :style="{color: m.sender.nickname_color ? m.sender.nickname_color : 'currentColor'}"
            class="nickname-text"
        >
          {{ m.sender.nickname }}
        </span>

        <message-item-media class="mb-1" :m="m.mediaInfo"/>

        <div class="msg-text__wrapper">
          <span class="msg-text" v-if="m.content">{{ m.content }}</span>

          <div class="msg-send__detail">
            <span class="msg-send___detail_time">{{ crSendTime }}</span>
            <div class="msg-send___detail_read-status" v-if="m.mode === 'internal'">
              <v-icon :size="12" color="green">{{ m.isRead ? 'mdi-check-all' : 'mdi-check' }}</v-icon>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>

</template>

<style scoped lang="scss">
.no_blurred__message{
  filter: none;
  position: relative;
  z-index: 5;
}

.message-item__wrapper {
  width: 100%;

  .message-item__system {
    width: fit-content;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 5px auto;

    .message-item__system-content {
      padding: 2px 10px;
      border-radius: 15px;
      border: 1px solid seagreen;
      background-color: rgba(76, 175, 80, 0.15);
      text-align: center;
    }
  }

  .message-item__default {
    &.internal {
      margin-left: auto;
      justify-content: flex-end;
      padding-left: 20px;
    }

    &.external {
      margin-right: auto;
      justify-content: flex-start;
      padding-right: 20px;
    }

    max-width: 350px;
    min-width: 100px;
    display: flex;
    gap: 10px;

    .message-item__content {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 5px;
      border-radius: 10px;
      border: 1px solid grey;

      .message-item__media-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }

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
  }

}

.msg-text {
  font-size: 14px;
}

.nickname-text {
  font-weight: 500;
}


</style>