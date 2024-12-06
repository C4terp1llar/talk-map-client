<script setup lang="ts">
import {useRouter} from "vue-router";
import type {ShortMutualUserFriend} from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";

const router = useRouter();

interface Props {
  mutual: ShortMutualUserFriend,
  isShort?: boolean,
  isWithoutNick?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <div :class="['mutual-friends-popup__list_item', props.isShort ? '__short' : '']">
    <div class="mutual-friends-popup__list_item__avatar">
      <v-avatar :class="['search-friend-list-item__avatar-item', props.isShort ? '__short' : '']">
        <v-img
            class="avatar-img"
            :src="props.mutual.avatar.asset_url"
            alt="avatar"
            cover
        >
          <template v-slot:placeholder>
            <skeleton-loader/>
          </template>
        </v-img>
        <router-link :to="{ name: 'friends-user', params: { id: props.mutual._id } }"/>
      </v-avatar>
    </div>
    <div class="mutual-friends-popup__list_item__nickname" v-if="!isWithoutNick">
      <router-link
          :style="{color: props.mutual.nickname_color ? props.mutual.nickname_color : 'currentColor'}"
          class="nickname-txt"
          :to="{ name: 'friends-user', params: { id: props.mutual._id } }"
      >{{ props.mutual.nickname }}
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mutual-friends-popup__list_item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px;
  min-width: 120px;
  max-width: 120px;

  &.__short {
    min-width: 100px;
    max-width: 100px;

    @media screen and (max-width: 1050px) {
      min-width: 82px !important;
      max-width: 82px !important;
      gap: 2px !important;
    }

    .nickname-txt{
      font-size: 14px;
    }
  }

  .mutual-friends-popup__list_item__nickname {
    text-align: center;

    .nickname-txt {
      max-width: 100%;
      word-break: break-word;
      overflow-wrap: break-word;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      line-height: 1.2em;

      @media screen and (max-width: 1050px) {
        font-size: 13px;
      }
    }
  }


  .mutual-friends-popup__list_item__avatar {
    .search-friend-list-item__avatar-item {
      position: relative;
      border: 2px solid green;
      min-width: 100px;
      min-height: 100px;

      @media screen and (max-width: 1050px) {
        min-width: 80px;
        min-height: 80px;
      }

      &.__short {
        min-width: 75px;
        min-height: 75px;

        @media screen and (max-width: 1050px) {
          min-width: 60px;
          min-height: 60px;
        }
      }

      a {
        position: absolute;
        inset: 0;
        border-radius: 50%;
      }
    }
  }


}
</style>