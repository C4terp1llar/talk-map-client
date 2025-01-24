<script setup lang="ts">
import type {GroupConv} from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {computed} from "vue";
import {formatSmartDate} from "@/helpers/dateHelper";

interface Props{
  conv: GroupConv
}

const props = defineProps<Props>()

const crSendTime = computed(() => formatSmartDate(props.conv.lastMessage.sendTime))


/*
PersonalConv{
    _id: string,
    owner_id: string,
    title: string,
    cover_url: string,
    messageCount: number,
    unreadMessagesCount: number,
    updatedAt: Date,
    lastMessage: {
         _id: string,
        sender: string,
        content: string,
        sendTime: Date,
        messageType: "default" | 'system',
        mode: 'internal' | 'external',
        isRead: boolean
    },
}
*/
</script>

<template>
  <div class="cm-group-conv-item">
    <div class="cm-group-conv-item__cover">
      <v-avatar :size="43">
        <v-img
            :src="conv.cover_url"
            alt="conversation cover"
            cover
        >
          <template v-slot:placeholder>
            <skeleton-loader/>
          </template>
        </v-img>
      </v-avatar>
    </div>
    <div class="cm-group-conv-item__detail">
      <div class="cm-group-conv-item__detail-head">
        <span class="nickname __no-wrap-txt">{{ conv.title }}</span>
        <div class="cm-group-conv-item__detail-head__send-detail">
          <div class="cm-group-conv-item__detail-msg__read-status" v-if="conv.lastMessage.mode === 'internal'">
            <v-icon :size="14" color="green">{{conv.lastMessage.isRead ? 'mdi-check-all' : 'mdi-check'}}</v-icon>
          </div>
          <span class="cm-group-conv-item__detail-msg__time">{{ crSendTime }}</span>
        </div>
      </div>
      <div class="cm-group-conv-item__detail-msg">
        <span class="cm-group-conv-item__detail-msg__content __no-wrap-txt">
          {{ conv.lastMessage.mode === 'internal' ? 'Вы: ' : `${conv.lastMessage.sender_nickname}: ` }}
          {{conv.lastMessage.content}}
        </span>
        <div class="cm-group-conv-item__detail-msg__unread-counter" v-if="conv.unreadMessagesCount">
          <span class="cm-group-conv-item__detail-msg__unread-counter__content">
            {{conv.unreadMessagesCount}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cm-group-conv-item{
  width: 100%;
  display: grid;
  gap: 10px;
  padding: 5px;
  grid-template-columns: auto 1fr;
  border-radius: 5px;

  border: 1px solid currentColor;

  .cm-group-conv-item__cover{
    grid-column: span 1;
  }

  .cm-group-conv-item__detail{
    grid-column: span 1;
    width: 100%;
    display: flex;
    flex-direction: column;

    .cm-group-conv-item__detail-head{
      width: 100%;
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      .nickname{
        grid-column: span 1;
        font-weight: 500;
      }
      .cm-group-conv-item__detail-head__send-detail{
        grid-column: span 1;
        display: flex;
        align-items: center;
        gap: 2px;
        margin-left: 3px;
        .cm-group-conv-item__detail-msg__time{
          font-size: 12px;
          opacity: .8;
        }
      }
    }
    .cm-group-conv-item__detail-msg{
      width: 100%;
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      .cm-group-conv-item__detail-msg__content{
        grid-column: span 1;
        font-size: 14px;
        opacity: .9;
      }
      .cm-group-conv-item__detail-msg__unread-counter{
        grid-column: span 1;
        border-radius: 8px;
        background-color: #cccccc;
        margin-left: 3px;
        min-width: 17px;
        padding: 0 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        .cm-group-conv-item__detail-msg__unread-counter__content{
          color: black;
          font-size: 11px;
        }
      }
    }
  }
}

.__no-wrap-txt{
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

</style>