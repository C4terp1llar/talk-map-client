<script setup lang="ts">
import type {ShortFriend} from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";

const emit = defineEmits<{
  (e: 'actSelectMember', uid: string): void
}>()

interface Props {
  member: ShortFriend,
  isSelectMode?: boolean,
  groupMembers?: string[],
}

defineProps<Props>()
</script>

<template>
  <div class="cm-group-members-item mt-2 mb-2">
    <div class="cm-group-members-item__main-content">
      <v-avatar :size="40">
        <v-img
            :src="member.avatar"
            alt="avatar"
            cover
        >
          <template v-slot:placeholder>
            <skeleton-loader/>
          </template>
          <router-link :to="{ name: 'friends-user', params: { id: member.user_id } }"/>
        </v-img>
      </v-avatar>

      <div class="mutual-friends-popup__list_item__nickname">
        <router-link
            :style="{color: member.nickname_color ? member.nickname_color : 'currentColor'}"
            class="nickname-txt"
            :to="{ name: 'friends-user', params: { id: member.user_id  } }"
        >{{ member.nickname }}
        </router-link>
      </div>
    </div>


    <div class="members-actions">
      <v-checkbox-btn v-if="isSelectMode && groupMembers" :model-value="groupMembers.includes(member.user_id)"
                      @click="emit('actSelectMember', member.user_id)" hide-details/>
    </div>

  </div>
</template>

<style scoped lang="scss">
.cm-group-members-item {
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 2px currentColor;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .cm-group-members-item__main-content{
    gap: 10px;
    display: flex;
    align-items: center;
  }
}

.nickname-txt {
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-height: 1.2em;
}
</style>