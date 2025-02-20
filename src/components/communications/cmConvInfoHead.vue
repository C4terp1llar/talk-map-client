<script setup lang="ts">
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import {useCmStore} from "@/stores/cmStore";
import {onMounted, ref} from "vue";
import ConvInfoHeadSkeleton from "@/components/skeletons/convInfoHeadSkeleton.vue";
import ChangeGroupConvTitle from "@/components/communications/changeGroupConvTitle.vue";
import type {GroupConv, PersonalConv} from "@/helpers/interfaces";

interface CmConvHeadData{
  _id: string,
  cover: string,
  title:  string,
  titleColor: string | null,
  type: string,
  opponent?: string
}

interface Props{
  data: CmConvHeadData
}
const props = defineProps<Props>()

const cmStore = useCmStore();
const pending = ref<boolean>(false);
const canChange = ref<boolean>(false);

onMounted(async () => {
  if (props.data.type === 'group'){
    pending.value = true;
    const meSnap = await cmStore.getMembersMe(props.data._id);
    pending.value = false;
    if (meSnap?.role && (meSnap.role === 'admin' || meSnap.role === 'owner')) {
      canChange.value = true;
    }
  }
})

const newTitle = ref<string>(props.data.title || '');
const isChangeTitle = ref<boolean>(false);

const titlePending = ref<boolean>(false);

const updTitle = async () => {
  if (newTitle.value === props.data.title) {
    isChangeTitle.value = false;
    return;
  }
  isChangeTitle.value = false;
  titlePending.value = true;
  const data = await cmStore.changeGroupTitle(props.data._id, newTitle.value);
  titlePending.value = false;

  if (cmStore.selectedDialog && data){
    if (!isPersonalConv(cmStore.selectedDialog)){
      cmStore.selectedDialog.title = data;
    }
  }

  await cmStore.reloadMessagesAndDialogs();
}

function isPersonalConv(dialog: PersonalConv | GroupConv): dialog is PersonalConv {
  return "opponent" in dialog;
}

</script>

<template>
  <conv-info-head-skeleton v-if="pending"/>

  <div class="cm-conv-info__head" v-else>
    <div class="head__cover">
      <v-avatar class="__avatar">
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
    </div>
    <div class="head__title" v-if="!isChangeTitle">
      <h4 v-if="!data.opponent" class="nickname __no-wrap-txt mt-2">{{ data?.title }}</h4>

      <router-link v-else :to="{ name: 'friends-user', params: { id: data.opponent } }">
        <h4 :style="{color: data?.titleColor ? data?.titleColor : 'currentColor'}" class="nickname __no-wrap-txt mt-2">{{ data?.title }}</h4>
      </router-link>

      <v-btn @click="isChangeTitle = true" class="change__title" density="compact" :disabled="titlePending"
             icon variant="tonal" v-if="data.type === 'group' && canChange" :loading="titlePending"
      >
        <v-icon color="green" :size="18">mdi-pencil</v-icon>
      </v-btn>
    </div>
    <change-group-conv-title v-if="data.type === 'group' && canChange && isChangeTitle"
                             @upd-title-handle="updTitle" @upd-title="title => newTitle = title"
                             :val="data.title" @close="isChangeTitle = false"
    />
  </div>
</template>

<style scoped lang="scss">
.cm-conv-info__head{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  .__avatar{
    height: 150px;
    width: 150px;
    @media (max-width: 650px){
      height: 100px;
      width: 100px;
    }
  }

  .head__title{
    position: relative;
    .change__title{
      position: absolute;
      right: -30px;
      top: 0;

    }
  }

}
</style>