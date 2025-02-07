<script setup lang="ts">
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {useCmStore} from "@/stores/cmStore";
import {computed} from "vue";
import type {GroupConv, PersonalConv} from "@/helpers/interfaces";
import {useRoute, useRouter} from "vue-router";

const cmStore = useCmStore();

function isPersonalConv(dialog: PersonalConv | GroupConv): dialog is PersonalConv {
  return "opponent" in dialog;
}

const data = computed(() => {
  const dialog = cmStore.selectedDialog;
  if (!dialog) return null;

  return {
    cover: isPersonalConv(dialog) ? dialog.opponent.avatar : dialog.cover_url,
    title: isPersonalConv(dialog) ? dialog.opponent.nickname : dialog.title,
    titleColor: isPersonalConv(dialog) ? dialog.opponent.nickname_color : null,
    type: isPersonalConv(dialog) ? 'personal' : 'group',
  }
});

const router = useRouter();
</script>

<template>
  <div class="cm-message-list-head__wrapper" v-if="cmStore.selectedDialog">
    <button class="btn__back" @click="router.push({query: {conv: undefined}})">
      <v-icon :size="24" color="green">mdi-arrow-left-bold-outline</v-icon>
    </button>

    <div class="cm-message-list-head__title">
      <v-avatar :size="43">
        <v-img
            :src="data?.cover"
            alt="conversation cover"
            cover
        >
          <template v-slot:placeholder>
            <skeleton-loader/>
          </template>
        </v-img>
      </v-avatar>
      <span :style="{color: data?.titleColor ? data?.titleColor : 'currentColor'}" class="nickname __no-wrap-txt">{{ data?.title }}</span>
    </div>

    <button class="load-more-btn__link">
      <v-icon>mdi-dots-horizontal</v-icon>
    </button>
  </div>
</template>

<style scoped lang="scss">
.btn__back{
  padding: 5px 5px 5px 0;
  margin-right: 5px;
  display: none;
  transition: .3s;
  &:hover{
    filter: drop-shadow(0 0 2px #4caf50);
  }
  @media (max-width: 950px){
    display: block;
  }
}

.cm-message-list-head__wrapper{
  width: 100%;
  box-shadow: 0 0 5px currentColor;
  border-radius: 10px;
  background: rgb(var(--v-theme-background));
  padding: 10px;
  display: flex;
  align-items: center;

  .cm-message-list-head__title{
    width: 100%;
    display: flex;
    grid-template-columns: repeat(2, auto);
    align-items: center;
    gap: 10px;
  }
  .load-more-btn__link{
    margin-left: auto;
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