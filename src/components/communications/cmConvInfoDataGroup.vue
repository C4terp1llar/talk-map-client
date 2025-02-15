<script setup lang="ts">
import {useCmStore} from "@/stores/cmStore";
import {onMounted, ref} from "vue";
import type {ConvMemberInfo} from "@/helpers/interfaces";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";
import PhotosNotFound from "@/components/photos/photosNotFound.vue";
import PhotosListItem from "@/components/photos/photosListItem.vue";
import GroupMembersItem from "@/components/communications/groupMembersItem.vue";
import TextDivider from "@/components/common/textDivider.vue";

interface Props {
  convId: string,
  convType: string,
}

const props = defineProps<Props>()

const cmStore = useCmStore()

onMounted(async () => {
  await uploadData('load')
})

const page = ref<number>(1);
const LIMIT = 50;

const pending = ref<boolean>(false);
const pendingMore = ref<boolean>(false);
const hasMore = ref<boolean>(false);

const sender = ref<ConvMemberInfo | null>(null);
const members = ref<ConvMemberInfo[] | null>(null);

const uploadData = async (mode: 'load' | 'more') => {
  if (mode === 'more'){
    page.value += 1;
  }
  const currPending = page.value < 2 ? pending : pendingMore;

  currPending.value = true;
  const data = await cmStore.getGroupMembers(props.convId, page.value, LIMIT)
  currPending.value = false;

  if (data && data.members && data.members.length && data.sender) {
    sender.value = data.sender;
    hasMore.value = data.hasMore;
    if (page.value < 2){
      members.value = data.members;
    }else if (members.value && page.value >= 2){
      members.value.push(...data.members);
    }
  }
}
</script>

<template>
  <div class="cm-conv-info-data-group">

    <lazy-placeholder-loader v-if="pending"/>

    <div class="members-list" v-if="!pending && members && members.length && sender">
      <group-members-item mode="me" :sender-role="sender.role" :member="sender"/>

      <text-divider text="Участники"/>
      <group-members-item mode="other" :sender-role="sender.role" v-for="m in members" :member="m" :key="m._id"/>

      <div class="controls  mt-1 d-flex justify-content-center">
        <v-btn
            color="green"
            class="text-none"
            variant="text"
            @click="uploadData('more')"
            v-if="hasMore && !pendingMore"
        >
          Еще
        </v-btn>
      </div>

      <pagination-dot-loader class="mt-1" v-if="pendingMore"/>
    </div>

    <div class="__no d-flex align-self-center text-center" v-if="pending && members && !members.length && !sender">
      <h6>Что-то пошло не так...</h6>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cm-conv-info-data-group{
  display: grid;
  height: 100%;
}
</style>