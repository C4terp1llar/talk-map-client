<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";
import FriendsMutualItem from "@/components/friends/friendsMutualItem.vue";
import MutalItemSkeleton from "@/components/skeletons/mutalItemSkeleton.vue";
import type {SearchFoundFriend, ShortMutualUserFriend} from "@/helpers/interfaces";
import {useFullPopupData} from "@/stores/fullPopupData";

interface Props {
  id: string,
  mode: 'friends' | 'mutual'
}

const props = defineProps<Props>();

const fullPopup = useFullPopupData();

const fullData = ref<ShortMutualUserFriend[] | SearchFoundFriend[] | null>(null)

const loadMoreFlag = computed(() => {
  return (
      fullData.value &&
      fullData.value.length === fullPopup.perPage * fullPopup.currentPage &&
      fullPopup.hasMore &&
      !fullPopup.pending &&
      !fullPopup.morePending
  )
})

const uploadData = async (mode: 'load' | 'load-more') => {
  if (!loadMoreFlag.value && mode === 'load-more') return;

  let data;

  if (props.mode === 'friends'){
    data = await fullPopup.findFriends(mode, undefined, props.id);
  }else{
    data = await fullPopup.getMutualFriends(mode, props.id);
  }

  if (mode === 'load' ){
    fullData.value = data
  }else if (fullData.value && mode === 'load-more'){
    fullData.value.push(...data)
  }
}


const shortFiends = computed((): ShortMutualUserFriend[] | void => {
  if (!fullData.value || props.mode !== 'friends') return;

  return fullData.value.map(user => {
    return {
      _id: user._id,
      nickname: user.nickname,
      nickname_color: user.nickname_color || null,
      avatar: {
        asset_url: user.avatar.asset_url
      },
    }
  })
})

onMounted(async () => {
  await uploadData('load')
})
</script>

<template>
  <div class="mutual-friends-popup__content-list" ref="mutualFriendsRef">

    <h5 class="text-center align-self-center">{{props.mode === 'mutual' ? 'Общие друзья' : 'Друзья'}}</h5>

    <div class="mutual-friends-popup__content-list__items">
      <mutal-item-skeleton v-for="i in 5" :key="i" v-if="fullPopup.pending"/>
      <friends-mutual-item v-for="mutual in props.mode === 'friends' ? shortFiends : fullData" :mutual="mutual" v-else/>

      <h4
          class="text-center"
          v-if="fullData && !fullData.length && !fullPopup.pending && !fullPopup.morePending"
      >
        {{ props.mode === 'friends' ? 'Друзей нет :(' : 'Общих друзей нет :('}}
      </h4>
    </div>

    <v-btn
        color="green"
        class="text-none w-100"
        variant="text"
        @click="uploadData('load-more')"
        v-if="loadMoreFlag && !fullPopup.pending && !fullPopup.morePending"
    >
      Еще
    </v-btn>

    <pagination-dot-loader v-if="fullPopup.morePending"/>
  </div>
</template>

<style scoped lang="scss">
.mutual-friends-popup__content-list {
  position: relative;

  @media screen and (max-width: 650px) {
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .mutual-friends-popup__content-list__items {
      margin: auto auto;
    }
  }

  .mutual-friends-popup__content-list__items {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>