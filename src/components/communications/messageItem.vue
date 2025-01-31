<script setup lang="ts">
import type {FullMessage} from "@/helpers/interfaces";
import {getMsgContent} from "../../helpers/cmHelpers";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {getFileIcon} from "@/helpers/fileDisplayCover";

interface Props {
  m: FullMessage
}

const props = defineProps<Props>()
</script>

<template>
  <div :class="['message-item__wrapper mt-2 mb-2']">

    <div class="message-item__system" v-if="m.messageType === 'system'">
      <div class="message-item__system-content">
        <span class="msg-text">{{getMsgContent(m)}}</span>
      </div>
    </div>

    <div :class="['message-item__default', m.mode]" v-else>

      <div class="message-item__avatar" v-if="m.conversationType === 'GroupConversation' && m.mode === 'external'">
        <v-avatar :size="43">
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

        <div class="message-item__media" v-if="m.mediaInfo && m.mediaInfo.length" v-for="i in m.mediaInfo" :key="i._id">

          <div class="file-preview__img" v-if="i.type.startsWith('image/')">
            <v-img :src="i.url" alt="Превью изображения" class="image-preview" cover>
              <template v-slot:placeholder>
                <skeleton-loader/>
              </template>
            </v-img>
          </div>

          <div class="file-preview__audio" v-else-if="i.type.startsWith('audio/')">
            <audio  controls class="audio-preview">
              <source :src="i.url" type="audio/mpeg"/>
              Ваш браузер не поддерживает аудио.
            </audio>
            <v-icon :size="65" class="icon-audio">mdi-music</v-icon>
          </div>

          <div class="file-preview__video" v-else-if="i.type.startsWith('video/')">
            <video controls class="video-preview">
              <source :src="i.url" type="video/mp4"/>
              Ваш браузер не поддерживает видео.
            </video>
          </div>

          <div class="file-preview__other" v-else>
            <v-icon :size="65" class="ma-auto">{{ getFileIcon(i.name) }}</v-icon>
            <span class="file__name">{{ i.name }}</span>
          </div>

        </div>

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