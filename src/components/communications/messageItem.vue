<script setup lang="ts">
import type {FullMessage} from "@/helpers/interfaces";
import {getMsgContent} from "../../helpers/cmHelpers";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import MessageItemMedia from "@/components/communications/messageItemMedia.vue";
import {computed} from "vue";
import {format} from "date-fns";

interface Props {
  m: FullMessage
}

const props = defineProps<Props>()

const crSendTime = computed(() => {
  return format(new Date(props.m.createdAt), 'HH:mm');
});

</script>

<template>
  <div :class="['message-item__wrapper mt-1 mb-1']">

    <div class="message-item__system" v-if="m.messageType === 'system'">
      <div class="message-item__system-content">
        <span class="msg-text">{{getMsgContent(m)}}</span>
      </div>
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

      <div class="message-item__content">

        <span
            v-if="m.conversationType === 'GroupConversation'"
            :style="{color: m.sender.nickname_color ? m.sender.nickname_color : 'currentColor'}"
            class="nickname-text"
        >
          {{ m.sender.nickname }}
        </span>

        <message-item-media :m="m.mediaInfo"/>

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
.message-item__wrapper{
  width: 100%;

  .message-item__system{
    display: flex;
    justify-content: center;
    .message-item__system-content{
      padding: 5px 10px;
      border-radius: 15px;
      box-shadow: 0 0 5px;
    }
  }

  .message-item__default{
    &.internal{
      margin-left: auto;
      justify-content: flex-end;
    }
    &.external{
      margin-right: auto;
      justify-content: flex-start;
    }

    max-width: 80%;
    min-width: 100px;
    width: auto;
    display: flex;
    gap: 10px;

    .message-item__content{
      display: flex;
      flex-direction: column;
      padding: 5px;
      border-radius: 10px;
      box-shadow: 0 0 5px;

      .message-item__media-wrap{
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }

      .msg-send__detail{
        height: 17px;
        display: flex;
        gap: 3px;
        align-items: center;
        flex-wrap: wrap;
        margin-left: auto;
        margin-top: auto;
        padding-left: 10px;
        .msg-send___detail_time{
          font-size: 11px;
          opacity: .7;
        }
      }

      .msg-text__wrapper{
        display: flex;
        flex-wrap: wrap;
      }
    }
  }

}

.msg-text{
  font-size: 14px;
}
.nickname-text{
  font-weight: 500;
}


</style>