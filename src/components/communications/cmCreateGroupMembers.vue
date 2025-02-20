<script setup lang="ts">
import {useFriendsStore} from "@/stores/friends";
import {computed, onMounted, ref} from "vue";
import type {ShortFriend} from "@/helpers/interfaces";
import ShortFriendInlineSkeleton from "@/components/skeletons/shortFriendInlineSkeleton.vue";
import PhotosListItem from "@/components/photos/photosListItem.vue";
import PhotosNotFound from "@/components/photos/photosNotFound.vue";
import PaginationDotLoader from "@/components/common/paginationDotLoader.vue";
import CmGroupMembersItem from "@/components/communications/cmGroupMembersItem.vue";
import TextDivider from "@/components/common/textDivider.vue";
import {debounce} from "perfect-debounce";
import {useCmStore} from "@/stores/cmStore";

interface Props{
  errors?: string[],
  addNewMembers?: boolean,
  convId?: string,
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'selectMemberUpdate', members: string[]): void
}>()

const frStore = useFriendsStore();
const cmStore = useCmStore();

const LIMIT = 10
const page = ref<number>(1);

const friends = ref<ShortFriend[] | null>(null);
const hasMore = ref<boolean>(false);

const newGroupMembers = ref<string[]>([]);
const newGroupMembersInfo = ref<ShortFriend[]>([]);

onMounted(async () => {
  firstLoadResulted.value = await uploadData('load');
})

const firstLoadResulted = ref<boolean>(false);

const pending = ref<boolean>(false);
const qPending = ref<boolean>(false);
const morePending = ref<boolean>(false);

const uploadData = async (mode: 'load' | 'load-more') => {
  let crPage = mode === 'load' ? page.value : page.value + 1;
  const crPending = mode === 'load' ? pending : morePending;

  if (!q.value) crPending.value = true;

  let data
  if (props.addNewMembers && props.convId){
    data = await cmStore.getNewMembers(props.convId, crPage, LIMIT, q.value)
  }else{
    data = await frStore.getFriends(crPage, LIMIT, q.value);
  }

  crPending.value = false;
  qPending.value = false;

  hasMore.value = data.hasMore;
  if (data.friends) {
    if (mode === 'load') {
      friends.value = data.friends
    } else if (mode === 'load-more' && friends.value) {
      friends.value = [...friends.value, ...data.friends];
    }
  }
  return !!(data.friends && data.friends.length)
}

const actSelectMember = (uid: string) => {
  const exist = newGroupMembers.value.find(i => i === uid);

  if (exist) {
    const index = newGroupMembers.value.indexOf(uid);
    if (index !== -1) {
      newGroupMembers.value.splice(index, 1);
      newGroupMembersInfoFilter('delete', uid)
      emit('selectMemberUpdate', newGroupMembers.value)
    }
  } else {
    newGroupMembers.value.push(uid)
    newGroupMembersInfoFilter('add', uid)
    emit('selectMemberUpdate', newGroupMembers.value)
  }
}

const newGroupMembersInfoFilter = (act: 'add' | 'delete', uid: string) => {
  if (friends.value && friends.value.length) {
    if (act === 'add') {
      const m = friends.value.find(i => i.user_id === uid)
      if (m){
        newGroupMembersInfo.value.push(m)
      }
    }else{
      newGroupMembersInfo.value = newGroupMembersInfo.value.filter(i => i.user_id !== uid)
    }
  }
}

const filterInpIconClick = () => {
  if (q.value){
    q.value = '';
    uploadData('load');
  }
}

const q = ref<string>('');

const debouncedOperation = debounce(async () => {
  qPending.value = true;
  await uploadData('load');
}, 500);

</script>

<template>
  <div :class="['cm-create-group-members', {'__exiting_group': addNewMembers}]">
    <short-friend-inline-skeleton v-for="i in 3" :key="i" class="mt-2 mb-2" v-if="pending && !firstLoadResulted"/>

    <div :class="['cm-create-group-members__selected-members styled-scroll__np __list', {'__add-new__added': addNewMembers}]" v-if="newGroupMembersInfo.length">
      <text-divider class="mt-2" :text="addNewMembers ? 'Новые участники' : 'Выбранные участники'"/>

      <cm-group-members-item v-for="m in newGroupMembersInfo" :key="m.user_id" :member="m" :is-select-mode="true"
                             :group-members="newGroupMembers" @act-select-member="f => actSelectMember(f)"/>
    </div>

    <div class="cm-create-group-members__content" v-if="friends">
      <text-divider v-if="!addNewMembers" text="Участники" class="mt-2 mb-2"/>

      <v-text-field
          v-if="firstLoadResulted"
          v-model.trim="q"
          variant="outlined"
          @keydown.enter="q ? debouncedOperation : false"
          @input="debouncedOperation"
          hide-details="auto"
          placeholder="Поиск"
          :append-inner-icon="!q ? 'mdi-magnify' : 'mdi-close'"
          @click:append-inner="filterInpIconClick"
          :loading="qPending"
          :error-messages="errors"
      />

      <div :class="['cm-create-group-members__content-members styled-scroll __list', {'__add-new': addNewMembers}]" v-if="friends.length">
        <cm-group-members-item v-for="f in friends" :key="f.user_id" :member="f" :is-select-mode="true"
                               :group-members="newGroupMembers" @act-select-member="m => actSelectMember(m)"/>

        <div class="controls  mt-1 d-flex justify-content-center" v-if="!morePending && hasMore">
          <v-btn
              color="green"
              class="text-none mb-1 w-100"
              variant="text"
              @click="uploadData('load-more')"
          >
            Еще
          </v-btn>
        </div>

        <pagination-dot-loader class="mt-1" v-if="morePending"/>
      </div>

    </div>

    <h6 class="text-center mt-2" v-if="friends && !friends.length && !pending">
      {{!firstLoadResulted ? 'У вас нет друзей, пока нельзя создать группу 🥺': 'Никого не нашлось 🔎'}}
    </h6>
  </div>
</template>

<style scoped lang="scss">
.cm-create-group-members{
  &.__exiting_group{
    padding: 0 5px;
  }
}

.__list{
  &.__add-new{
    max-height: unset;
    overflow: unset;
    padding: unset;
  }
  &.__add-new__added{
    padding: 0 1px;
  }
  max-height: 500px;
  overflow: auto;
  padding: 0 5px;
}

</style>