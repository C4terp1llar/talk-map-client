<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import type {SearchFoundFriend} from "@/helpers/interfaces";
import {useUserStore} from "@/stores/user";
import {useExternalUserStore} from "@/stores/externalUser";
import {useRouter} from "vue-router";
import FriendsMutual from "@/components/friends/friendsMutual.vue";

const router = useRouter();

interface Props {
  user: SearchFoundFriend
}
const props = defineProps<Props>()

const getUserAge = (bDate: Date) => {
  return new Date().getFullYear() - new Date(bDate).getFullYear()
}

const handleSubmit = (uid: string) => {
  router.push({ name: 'friends-user', params: { id: uid } })
}
</script>

<template>
  <div class="search-friend-list-item">
    <div class="search-friend-list-item__avatar">
      <v-avatar class="search-friend-list-item__avatar-item">
        <v-img
            class="avatar-img"
            :src="props.user.avatar.asset_url"
            alt="avatar"
            cover
        >
          <template v-slot:placeholder>
            <skeleton-loader/>
          </template>
        </v-img>
        <button @click="handleSubmit(props.user._id)"></button>
      </v-avatar>
    </div>

    <div class="search-friend-list-item__info">

      <div class="search-friend-list-item__info-personal">
        <div class="search-friend-list-item__info-personal__nickname">
          <router-link
              :style="{color: props.user.nickname_color ? props.user.nickname_color : 'currentColor'}"
              class="nickname-txt"
              :to="{ name: 'friends-user', params: { id: props.user._id } }"
          >{{props.user.nickname}}</router-link>
        </div>
        <div class="search-friend-list-item__info-personal__age-gender">
          <v-icon>{{props.user.gender === 'male' ? 'mdi-face-man-shimmer' : 'mdi-face-woman-shimmer'}}</v-icon>
          <span>{{getUserAge(props.user.b_date)}}</span>
        </div>
      </div>

      <div class="search-friend-list-item__info-location user-location">
        <i :class="`flag fi fi-${props.user.address.country_code}`"></i>
        <span class="flag-txt">{{ `${props.user.address.city}, ${props.user.address.country}` }}</span>
      </div>

      <div class="mutual-wrapper" v-if="props.user.mutual.amount">
        <friends-mutual :mutual="props.user.mutual"/>
      </div>

      <button class="abs-select-btn" @click="handleSubmit(props.user._id)"></button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.abs-select-btn{
  button{
    position: absolute;
    inset: 0;
  }
}

.search-friend-list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 15px;
  border: 1px solid currentColor;

  @media screen and (max-width: 450px){
    flex-direction: column;
  }
  .search-friend-list-item__avatar{
    .search-friend-list-item__avatar-item{
      position: relative;
      border: 2px solid green;
      min-width: 100px;
      min-height: 100px;

      @media screen and (max-width: 768px){
        min-width: 80px;
        min-height: 80px;
      }
      button{
        position: absolute;
        inset: 0;
        border-radius: 50%;
      }
    }
  }

  .search-friend-list-item__info{
    display: flex;
    flex-direction: column;
    gap: 2px;
    position: relative;

    .search-friend-list-item__info-personal{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;

      .nickname-txt{
        margin: 0;
        cursor: pointer;
        font-weight: 500;
        font-size: 1.3rem;
      }

      @media screen and (max-width: 450px){
        justify-content: center;
      }

      .search-friend-list-item__info-personal__age-gender{
        display: flex;
        padding: 5px;
        gap: 5px;
        border-radius: 25px;
        border: 2px solid currentColor;
        font-size: 14px;
      }
    }

    .search-friend-list-item__info-location{
      @media screen and (max-width: 450px){
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

</style>