<script setup lang="ts">
import type {FullMessage} from "@/helpers/interfaces";
import {getMsgContent} from "../../helpers/cmHelpers";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {getFileIcon} from "@/helpers/fileDisplayCover";
import MessageItemMedia from "@/components/communications/messageItemMedia.vue";

interface Props {
  m: FullMessage
}

const props = defineProps<Props>()
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

        <span class="msg-text" v-if="m.content">{{m.content}}</span>

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

    max-width: 50%;
    min-width: 300px;
    width: auto;
    display: flex;
    gap: 10px;

    .message-item__content{
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 5px;
      border-radius: 10px;
      box-shadow: 0 0 5px;

      .message-item__media-wrap{
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }
    }
  }

}

.msg-text{
  font-size: 15px;
}
.nickname-text{
  font-weight: 500;
}

.file-preview__audio, .file-preview__video, .file-preview__img,  .file-preview__other{
  width: 200px;

  video{
    height: inherit;
    width: inherit;
  }

}
</style>