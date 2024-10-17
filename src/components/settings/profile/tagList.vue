<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import {vAutoAnimate} from "@formkit/auto-animate/vue";
import {useNotificationStore} from "@/stores/notifications";
import {ref} from "vue";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";

interface Props {
  isPreview: boolean,
}
const props = defineProps<Props>()

const deletingTag = ref<string | null>(null);

const userStore = useUserStore()
const notificationsStore = useNotificationStore()

const deleteTag = async (deleteTagText: string) => {
  deletingTag.value = deleteTagText;
  await userStore.deleteUserTag(deleteTagText);

  if (userStore.tagDeleteError) {
    notificationsStore.addNotification('error', userStore.tagDeleteError, 5000)
  }else{
    notificationsStore.addNotification('success', 'Тег успешно удален', 5000)
  }
  deletingTag.value = null;
}
</script>

<template>
  <div :class="['tags-wrapper',props.isPreview ? '__prev' : '__non-prev']" v-if="userStore.mainUserInfo">

    <div
        class="tag-content-wrapper"
        v-if="userStore.mainUserInfo.tags"
        v-for="tag in userStore.mainUserInfo.tags"
        :key="tag.text"
    >
      <div class="tag-content">
        <div class="emoji emoji-font">{{ tag.emoji }}</div>
        <span class="tag-text">{{ tag.text }}</span>

        <button class="delete-btn" v-if="props.isPreview" @click="deleteTag(tag.text)" :disabled="userStore.tagDeletePending">
          <template v-if="deletingTag === tag.text">
            <v-progress-circular
                color="red"
                indeterminate
                size="20"
            ></v-progress-circular>
          </template>
          <template v-else>
            <v-icon size="small" color="red">mdi-trash-can-outline</v-icon>
          </template>
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.tags-wrapper {
  display: flex;
  justify-content: center;
  gap: 10px;
  &.__prev{
    flex-wrap: wrap;
  }
  &.__non-prev{
    flex-wrap: nowrap;
  }
}

.tag-content-wrapper {
  padding: 2px;
  border-radius: 25px;
  width: fit-content;
  background: linear-gradient(
          90deg,
          red,
          orange,
          yellow,
          green,
          blue,
          indigo,
          violet
  );
  filter: drop-shadow(0 0 3px currentColor);

  .tag-content {
    width: fit-content;
    border-radius: 25px;
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 5px 10px;
    background-color: rgb(var(--v-theme-background));
  }
}

.tag-text {
  font-weight: 600;
  font-size: 14px;
}

.delete-btn{
  transition: .3s;
  opacity: 1;

  &:hover{
    filter: drop-shadow(0 0 3px rgba(255, 0, 0, 0.45));
  }
}
</style>