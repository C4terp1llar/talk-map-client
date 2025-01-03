<script setup lang="ts">
import type {PhotoG, Post} from "@/helpers/interfaces";
import {usePhotoStore} from "@/stores/photo";
import {useUserStore} from "@/stores/user";
import {useNotificationStore} from "@/stores/notifications";
import {format} from "date-fns";
import {formatShortDate} from "../../helpers/dateHelper";

interface Props {
  post: Post,
}

const props = defineProps<Props>();

const emit = defineEmits(['actComments'])

const phStore = usePhotoStore();
const uStore = useUserStore();
const ntfStore = useNotificationStore();

const handleReact = async () => {
  if (props.post.mode === 'internal' || !uStore.mainUserInfo?._id) return;

  await phStore.reactAction('Post', props.post._id, uStore.mainUserInfo?._id);

  if (phStore.reactError) {
    ntfStore.addNotification('error', phStore.reactError, 3000)
  } else {
    if (phStore.currentPhoto) {
      phStore.currentPhoto.likesCount += phStore.currentPhoto.liked ? -1 : 1;
      phStore.currentPhoto.liked = !phStore.currentPhoto.liked;
    }
  }
}
</script>

<template>
  <div class="post-item__reactions">
    <div class="post__actions">
      <div class="reactions-likes">
        <button
            :class="['reactions__btn', post.mode === 'internal' ? '__non-hover' : '', { 'loading': phStore.reactPending }]"
            :disabled="post.mode === 'internal' || phStore.reactPending"
            @click="handleReact"
        >
          <v-icon :size="25" color="red">{{ post.liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </button>
        <span class="reactions__amount">{{ post.likes_count }}</span>
      </div>

      <div class="reactions-comments">
        <button
            class="reactions__btn __comment"
            @click="emit('actComments')"
        >
          <v-icon :size="24" >mdi-comment-text-outline</v-icon>
        </button>
        <!--      <span class="comments__amount">{{ post.likesCount }}</span>-->
      </div>
    </div>


    <span class="publish__date">{{ formatShortDate(post.createdAt) }}</span>
  </div>
</template>

<style scoped lang="scss">
.post-item__reactions {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .post__actions{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;

    .reactions-likes {
      display: flex;
      align-items: flex-end;
    }
    .reactions-comments{

    }
  }

  .publish__date {
    opacity: 0.8;
    font-size: 11px;
    font-weight: 500;
    color: grey;
  }
}


.reactions__btn {
  padding: 5px 5px 0 0;
  border-radius: 5px;
  transition: .3s;

  &.__comment{
    padding: 5px 5px 0 5px;
  }

  &.loading {
    animation: pulsate .8s infinite;
    pointer-events: none;
  }

  &:not(.__non-hover):hover {
    filter: drop-shadow(0 0 1px red);
  }

  &.__comment:hover{
    filter: drop-shadow(0 0 1px currentColor);
  }
}

@keyframes pulsate {
  0% {
    filter: drop-shadow(0 0 2px rgba(255, 0, 0, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(255, 0, 0, 0.7));
  }
  100% {
    filter: drop-shadow(0 0 2px rgba(255, 0, 0, 0.5));
  }
}

.reactions__amount {
  font-size: 11px;
  font-weight: 500;
  color: #f44336;
}
</style>