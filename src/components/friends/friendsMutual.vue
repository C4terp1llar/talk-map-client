<script setup lang="ts">
import type {ShortMutualUserFriend} from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {onClickOutside} from "@vueuse/core";
import {ref} from "vue";
import ScrollableContainer from "@/components/common/scrollableContainer.vue";
import FriendsMutualFull from "@/components/friends/friendsMutualFull.vue";

const showFullMutual = ref<boolean>(false);

const handleClose = () => {
  setTimeout(() => {
    showFullMutual.value = false;
  }, 0)
}

interface Props {
  mutual: {
    mFriends: ShortMutualUserFriend[],
    amount: number,
    hasMore: boolean | null;
  },
  uid: string
}

const props = defineProps<Props>();
</script>

<template>
  <div class="mutual-friends__wrapper" ref="mutualFriendsRef">
    <div class="mutual-friends__icon ">
      <span class="friends-counter">{{props.mutual.amount}}</span>
      <v-icon :size="28">mdi-account-supervisor</v-icon>
    </div>

    <scrollable-container class="ma-0" mode="filter">
      <div class="mutual-friends__wrapper">
        <div class="mutual-friends__item" v-for="mutualFriend in props.mutual.mFriends" :key="mutualFriend._id">

          <v-avatar class="mutual-friends__item__avatar-item">
            <v-img
                :src="mutualFriend.avatar.asset_url"
                alt="avatar"
                cover
            >
              <template v-slot:placeholder>
                <skeleton-loader/>
              </template>
            </v-img>
          </v-avatar>

          <span
              :style="{color: mutualFriend.nickname_color ? mutualFriend.nickname_color : 'currentColor'}"
              class="nickname-txt"
          >{{ mutualFriend.nickname }}
          </span>

          <router-link :to="{ name: 'friends-user', params: { id: mutualFriend._id } }"/>
        </div>
      </div>
    </scrollable-container>

    <button v-if="props.mutual.amount > 3" class="load-more" @click="showFullMutual = true">
      <v-icon color="green">mdi-dots-horizontal</v-icon>
    </button>

    <friends-mutual-full @close="handleClose" :id="props.uid" v-if="showFullMutual"/>
  </div>
</template>

<style scoped lang="scss">
.mutual-friends__wrapper-popup {

  position: fixed;
  inset: 0;
  z-index: 10003;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);

}

.mutual-friends__wrapper {
  display: flex;
  gap: 5px;
  align-items: center;

  .load-more {
    padding: 5px;
    transition: .3s;
    border-radius: 5px;

    &:hover {
      background-color: rgba(211, 211, 211, 0.25);
    }
  }

  .mutual-friends__icon{
    padding: 5px;
    gap: 5px;
    display: flex;
    align-items: center;
    color: #4CAF50;

    .friends-counter{
      font-size: 12px;
      font-weight: 600;
    }
  }

  .mutual-friends__item {
    padding: 5px;
    border-radius: 15px;
    display: flex;
    gap: 5px;
    align-items: center;
    position: relative;
    transition: .3s;
    overflow: hidden;

    &:hover {
      background-color: rgba(211, 211, 211, 0.25);
    }

    .mutual-friends__item__avatar-item {
      width: 35px;
      height: 35px;
      border: 2px solid rgb(var(--v-theme-background));
    }

    a {
      position: absolute;
      inset: 0;
    }
  }
}

</style>