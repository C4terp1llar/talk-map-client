<script setup lang="ts">
import type {FriendRequest} from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {useRouter} from "vue-router";
import FriendsReqsActions from "@/components/friends/friendsReqsActions.vue";
import {format} from 'date-fns';
import FriendsMutual from "@/components/friends/friendsMutual.vue";

interface Props {
  mode: 'incoming' | 'outgoing',
  request: FriendRequest
}

const props = defineProps<Props>()

const router = useRouter();

const handleSubmit = (recipient: string, sender: string) => {
  if (props.mode === 'incoming') {
    router.push({name: 'friends-user', params: {id: sender}})
  } else {
    router.push({name: 'friends-user', params: {id: recipient}})
  }
}

const getUserAge = (bDate: Date) => {
  return new Date().getFullYear() - new Date(bDate).getFullYear()
}

const getSendTime = (sendTime: Date, mode: 'time' | 'date') => {
  if (mode === 'time') {
    return format(new Date(sendTime), "HH:mm")
  } else {
    return format(new Date(sendTime), "dd.MM.yyyy")
  }
}

</script>

<template>
  <div class="friends-reqs-list-item">

    <div class="friends-reqs-list-item__actions">
      <friends-reqs-actions :mode="props.mode"
                            :req="{recipient: props.request.recipient_id, sender: props.request.sender_id}"/>
    </div>

    <div class="friends-reqs-list-item__send-time">
      <span>{{ getSendTime(props.request.send_time, 'time') }}</span>
      <span>{{ getSendTime(props.request.send_time, 'date') }}</span>
    </div>

    <div class="friends-reqs-list-item__avatar">
      <v-avatar class="friends-reqs-list-item__avatar-item">
        <v-img
            class="avatar-img"
            :src="props.request.avatar.asset_url"
            alt="avatar"
            cover
        >
          <template v-slot:placeholder>
            <skeleton-loader/>
          </template>
        </v-img>

        <button @click="handleSubmit(props.request.recipient_id, props.request.sender_id)"></button>
      </v-avatar>
    </div>
    <div class="friends-reqs-list-item__info">

      <div class="friends-reqs-list-item__info-personal">
        <div class="friends-reqs-list-item__info-personal__nickname">
          <a
              :style="{color: props.request.userInfo.nickname_color ? props.request.userInfo.nickname_color : 'currentColor'}"
              class="nickname-txt"
              @click.prevent="handleSubmit(props.request.recipient_id, props.request.sender_id)"
          >{{ props.request.userInfo.nickname }}</a>
        </div>
        <div class="friends-reqs-list-item__info-personal__age-gender">
          <v-icon>{{ props.request.userInfo.gender === 'male' ? 'mdi-face-man-shimmer' : 'mdi-face-woman-shimmer' }}
          </v-icon>
          <span>{{ getUserAge(props.request.userInfo.b_date) }}</span>
        </div>
      </div>

      <div class="friends-reqs-list-item__info-location user-location">
        <i :class="`flag fi fi-${props.request.address.country_code}`"></i>
        <span class="flag-txt">{{ `${props.request.address.city}, ${props.request.address.country}` }}</span>
      </div>

      <div class="mutual-wrapper" v-if="props.request.mutual.amount">
        <friends-mutual :mutual="props.request.mutual" :uid="props.mode === 'incoming' ? props.request.sender_id : props.request.recipient_id"/>
      </div>

      <button
          class="abs-select-btn"
          @click="handleSubmit(props.request.recipient_id, props.request.sender_id)"
      ></button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.abs-select-btn {
  button {
    position: absolute;
    inset: 0;
  }
}

.friends-reqs-list-item {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 15px;
  border: 1px solid currentColor;

  .friends-reqs-list-item__actions {
    position: absolute;
    right: 5px;
    top: 5px;
    z-index: 10;
  }

  .friends-reqs-list-item__send-time {
    position: absolute;
    right: 10px;
    bottom: 5px;

    display: flex;
    gap: 5px;

    @media screen and (max-width: 450px) {
      top: 5px;
      gap: 0;
      left: 10px;
      flex-direction: column;
    }

    span {
      opacity: 0.8;
      font-size: 12px;
      font-weight: 500;
      color: grey;
      align-self: flex-start;
    }

  }

  @media screen and (max-width: 450px) {
    flex-direction: column;
  }

  .friends-reqs-list-item__avatar {
    .friends-reqs-list-item__avatar-item {
      position: relative;
      border: 2px solid green;
      min-width: 100px;
      min-height: 100px;

      @media screen and (max-width: 768px) {
        min-width: 80px;
        min-height: 80px;
      }

      button {
        position: absolute;
        inset: 0;
        border-radius: 50%;
      }
    }
  }

  .friends-reqs-list-item__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    position: relative;

    .friends-reqs-list-item__info-personal {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;

      .nickname-txt {
        margin: 0;
        cursor: pointer;
        font-weight: 500;
        font-size: 1.3rem;
      }

      @media screen and (max-width: 450px) {
        justify-content: center;
      }

      .friends-reqs-list-item__info-personal__age-gender {
        display: flex;
        padding: 5px;
        gap: 5px;
        border-radius: 25px;
        border: 2px solid currentColor;
        font-size: 14px;
      }
    }

    .friends-reqs-list-item__info-location {
      @media screen and (max-width: 450px) {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

</style>