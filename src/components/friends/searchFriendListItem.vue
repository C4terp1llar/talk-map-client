<script setup lang="ts">

import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import type {SearchFoundFriend} from "@/helpers/interfaces";
import {useUserStore} from "@/stores/user";
import {useExternalUserStore} from "@/stores/externalUser";
import {useRouter} from "vue-router";

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
      </v-avatar>
    </div>
    <div class="search-friend-list-item__info">

      <div class="search-friend-list-item__info-personal">
        <div class="search-friend-list-item__info-personal__nickname">
          <h5
              :style="{color: props.user.nickname_color ? props.user.nickname_color : 'currentColor'}"
              class="ma-0"
          >{{props.user.nickname}}</h5>
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


      <button @click="handleSubmit(props.user._id)"></button>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
      border: 2px solid green;
      min-width: 100px;
      min-height: 100px;

      @media screen and (max-width: 768px){
        min-width: 80px;
        min-height: 80px;
      }
    }
  }

  .search-friend-list-item__info{
    display: flex;
    flex-direction: column;
    gap: 2px;
    position: relative;

    button{
      position: absolute;
      inset: 0;
    }

    .search-friend-list-item__info-personal{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;

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
  }
}

</style>