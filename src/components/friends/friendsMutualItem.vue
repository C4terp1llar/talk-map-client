<script setup lang="ts">
import {useRouter} from "vue-router";
import type {ShortMutualUserFriend} from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";

const router = useRouter();

const emit = defineEmits(['redirectToUser']);

interface Props {
  mutual: ShortMutualUserFriend,
  isShort?: boolean,
  isWithoutNick?: boolean
}

const props = defineProps<Props>()

const handleSelect = () => {
  emit('redirectToUser')
}

</script>

<template>
  <div :class="['mutual-friends-popup__list_item', props.isShort ? '__short' : '']">

    <div :class="['mutual-friends-popup__list_item__avatar', props.isShort ? '__short' : '']">

      <v-avatar :class="['avatar-block', props.isShort ? '__short' : '']">
        <v-img
            :src="props.mutual.avatar.asset_url"
            alt="avatar"
            cover
        >
          <template v-slot:placeholder>
            <skeleton-loader/>
          </template>
          <router-link @click="handleSelect" :to="{ name: 'friends-user', params: { id: props.mutual._id } }"/>
        </v-img>
      </v-avatar>


    </div>

    <div class="mutual-friends-popup__list_item__nickname" v-if="!isWithoutNick">
      <router-link
          @click="handleSelect"
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

  gap: 5px;
  padding: 10px;
  width: 120px;
  height: 120px;

  &.__short {
    padding: 0;
    width: 85px;
    height: 85px;

    @media screen and (max-width: 550px){
      width: 70px;
      height: 70px;
    }

    .nickname-txt{
      font-size: 14px;
    }
  }

  .mutual-friends-popup__list_item__nickname {
    text-align: center;
    grid-row: span 1;

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
    position: relative;
    overflow: hidden;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .avatar-block{
      position: relative;
      width: 75px;
      height: 75px;

      &.__short{
        width: 60px;
        height: 60px;

        @media screen and (max-width: 550px){
          width: 45px;
          height: 45px;
        }
      }

      a {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        z-index: 1 !important;
      }
    }


    //&.__short {
    //  width: 100%;
    //  height: 100%;
    //}


  }

}
</style>