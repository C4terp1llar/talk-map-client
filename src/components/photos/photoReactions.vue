<script setup lang="ts">
import type {PhotoG} from "@/helpers/interfaces";
import {format} from "date-fns";
import {usePhotoStore} from "@/stores/photo";
import {useUserStore} from "@/stores/user";
import {useNotificationStore} from "@/stores/notifications";
import {formatShortDate} from "../../helpers/dateHelper";

interface Props {
  photo: PhotoG,
}

const props = defineProps<Props>()

const phStore = usePhotoStore();
const uStore = useUserStore();
const ntfStore = useNotificationStore();

const handleReact = async () => {
  if (props.photo.mode === 'internal' || !uStore.mainUserInfo?._id) return;

  await phStore.reactAction('Photo', props.photo._id, uStore.mainUserInfo?._id);

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
  <div class="media-content__reactions">
    <div class="reactions-likes">
      <button
          :class="['reactions__btn', photo.mode === 'internal' ? '__non-hover' : '', { 'loading': phStore.reactPending }]"
          :disabled="photo.mode === 'internal' || phStore.reactPending"
          @click="handleReact"
      >
        <v-icon :size="30" color="red">{{ photo.liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
      </button>
      <span class="reactions__amount">{{ photo.likesCount }}</span>
    </div>

    <span class="publish__date">в {{ formatShortDate(photo.createdAt) }}</span>
  </div>
</template>

<style scoped lang="scss">
.media-content__reactions {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .reactions-likes {
    display: flex;
    align-items: flex-end;
  }

  .publish__date {
    opacity: 0.8;
    font-size: 11px;
    font-weight: 500;
    color: grey;
  }
}


.reactions__btn {
  padding: 5px 5px 0 5px;
  border-radius: 5px;
  transition: .3s;

  &.loading {
    animation: pulsate .8s infinite;
    pointer-events: none;
  }

  &:not(.__non-hover):hover {
    filter: drop-shadow(0 0 1px red);
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