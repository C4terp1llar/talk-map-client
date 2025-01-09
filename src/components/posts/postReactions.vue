<script setup lang="ts">
import type {PhotoG, Post} from "@/helpers/interfaces";
import {usePhotoStore} from "@/stores/photo";
import {useUserStore} from "@/stores/user";
import {useNotificationStore} from "@/stores/notifications";
import {formatShortDate} from "../../helpers/dateHelper";
import {usePostStore} from "@/stores/post";
import {useRoute} from "vue-router";
import {ref} from "vue";

const postStore = usePostStore();
const route = useRoute();

interface Props {
  post: Post,
}

const props = defineProps<Props>();

const emit = defineEmits(['actComments'])

const phStore = usePhotoStore();
const uStore = useUserStore();
const ntfStore = useNotificationStore();

const currentPending = ref<string | null>(null)

const handleReact = async () => {
  if (props.post.mode === 'internal' || !uStore.mainUserInfo?._id) return;
  currentPending.value = props.post._id
  await phStore.reactAction('Post', props.post._id, uStore.mainUserInfo?._id);
  currentPending.value = null

  if (phStore.reactError) {
    ntfStore.addNotification('error', phStore.reactError, 3000)
  } else {
    props.post.likes_count += props.post.liked ? -1 : 1;
    props.post.liked = !props.post.liked;

    if (postStore.posts && route.query.p) {
      const currentPost = postStore.posts.find(i => i._id === props.post._id)
      if (currentPost) {
        currentPost.likes_count += currentPost.liked ? -1 : 1;
        currentPost.liked = !currentPost.liked;
      }
    }
    //дополнителдьно в глоб компоненте постов ексть подписка на это событие, которая управляет локальным стейтом полученного поста и раскидывает его в пропсах
  }
}

</script>

<template>
  <div class="post-item__reactions">
    <div class="post__actions">
      <div class="reactions-likes">
        <button
            :class="['reactions__btn', post.mode === 'internal' ? '__non-hover' : '', { 'loading': currentPending === props.post._id }]"
            :disabled="post.mode === 'internal' ||  currentPending === props.post._id"
            @click="handleReact"
        >
          <v-icon :size="25" color="red">{{ post.liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </button>
        <span class="reactions__amount">{{ post.likes_count }}</span>
      </div>

      <div class="reactions-likes">
        <button
            class="reactions__btn __comment"
            @click="emit('actComments')"
        >
          <v-icon :size="25">mdi-comment-text-outline</v-icon>
        </button>
        <span class="comments__amount">{{ post.comments_count }}</span>
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

  .post__actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;

    .reactions-likes, reactions-comments {
      display: flex;
      align-items: flex-end;
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

  &.__comment {
    padding: 5px 5px 0 5px;
  }

  &.loading {
    animation: pulsate .8s infinite;
    pointer-events: none;
  }

  &:not(.__non-hover):hover {
    filter: drop-shadow(0 0 1px red);
  }

  &.__comment:hover {
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
.comments__amount {
  font-size: 11px;
  font-weight: 500;
  color: currentColor;
}
</style>