<script setup lang="ts">
import SkeletonLoader from "@/components/common/skeletonLoader.vue";

const emit = defineEmits(['clearReply'])

interface Props {
  reply: {comment_id: string, to: { _id: string; nickname: string; nickname_color: string | null; avatar: string}}
}

const props = defineProps<Props>();
</script>

<template>
  <div class="post-editor__reply mb-1" v-if="reply">
    <span>Ответ</span>

    <v-avatar :size="15">
      <v-img :src="reply.to.avatar" alt="avatar" cover>
        <template v-slot:placeholder>
          <skeleton-loader/>
        </template>
      </v-img>
    </v-avatar>

    <router-link
        :style="{color: reply.to.nickname_color ? reply.to.nickname_color : 'currentColor'}"
        class="nickname-txt"
        :to="{ name: 'friends-user', params: { id: reply.to._id } }"
    >{{ reply.to.nickname }}
    </router-link>

    <button @click="emit('clearReply')">
      <v-icon :size="24" color="red">mdi-close</v-icon>
    </button>
  </div>
</template>

<style scoped lang="scss">
.post-editor__reply{
  margin-left: 43px;
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: 12px;
}
</style>