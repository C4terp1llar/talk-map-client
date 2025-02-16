<script setup lang="ts">
import type {ConvMemberInfo, ShortFriend} from "@/helpers/interfaces";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import TextDivider from "@/components/common/textDivider.vue";
import {computed, ref} from "vue";
import GroupMembersItemMenu from "@/components/communications/groupMembersItemMenu.vue";

const emit = defineEmits<{
  (e: 'reload'): void,
}>()

const isMenuVisible = ref(false);

interface Props {
  member: ConvMemberInfo,
  mode: 'me' | 'other',
  senderRole: 'owner' | 'admin' | 'member';
  convId: string;
}

const props = defineProps<Props>()

const userRolesMap = {
  owner: {
    label: "Владелец",
    color: "#FFC107",
    icon: "mdi-crown",
  },
  admin: {
    label: "Админ",
    color: "#FF5733",
    icon: "mdi-security",
  },
  member: {
    label: null,
    color: "#4CAF50",
    icon: "mdi-account",
  }
};

const roleInfo = computed(() => userRolesMap[props.member.role] || {});

const handleMenuClose = () => {
  setTimeout(() => {
    isMenuVisible.value = false
  })
}
</script>

<template>
  <div class="cm-group-members-item mt-2 mb-2">

    <div class="cm-group-members-item__main-content">
      <div class="user__info">
        <v-avatar :size="40">
          <v-img
              :src="member.avatar"
              alt="avatar"
              cover
          >
            <template v-slot:placeholder>
              <skeleton-loader/>
            </template>
            <router-link :to="{ name: 'friends-user', params: { id: member._id } }"/>
          </v-img>
        </v-avatar>

        <div class="mutual-friends-popup__list_item__nickname">
          <router-link
              :style="{color: member.nickname_color ? member.nickname_color : 'currentColor'}"
              class="nickname-txt"
              :to="{ name: 'friends-user', params: { id: member._id  } }"
          >{{ member.nickname }}
          </router-link>
        </div>
      </div>

      <div class="user__role" :style="{ color: roleInfo.color }">
        <v-icon :size="18">{{ roleInfo.icon }}</v-icon>
        <span v-if="roleInfo.label">{{ roleInfo.label }}</span>
      </div>
    </div>

    <div class="members-actions" v-if="mode === 'me' || (senderRole === 'admin' && member.role === 'member') || senderRole === 'owner'">
      <v-btn icon density="compact" class="ml-3" variant="text" @click="isMenuVisible = true">
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
    </div>

    <div class="members-actions__menu" v-if="isMenuVisible">
      <group-members-item-menu @reload="emit('reload')" :conv-id="convId" @close="handleMenuClose" :mode="mode" :member="member" :sender-role="senderRole"/>
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
  position: relative;

  .members-actions__menu{
    position: absolute;
    top: 80%;
    right: 0;
    z-index: 10;
  }

  .cm-group-members-item__main-content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .user__info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user__role{
      display: flex;
      align-items: center;
      gap: 5px;
      span{
        font-size: 12px;
        opacity: .8;
      }
    }
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