<script setup lang="ts">
import { useNotificationStore } from "@/stores/notifications";
import FriendsMutualItem from "@/components/friends/friendsMutualItem.vue";
import type {FrNotification} from "@/helpers/interfaces";

const store = useNotificationStore();

const notificationMap = new Map([
  ['error', 'mdi-alert-octagon-outline'],
  ['warning', 'mdi-alert-outline'],
  ['success', 'mdi-check-circle-outline'],
  ['info', 'mdi-information-variant-circle-outline']
]);

const getIcon = (type: string) => {
  return notificationMap.get(type)
};

const frMap = new Map([
  ['receive', 'Решил(а) добавить вас в друзья. Примем вызов? 💡'],
  ['abort', 'Отменил(а) свою заявку в друзья. Что-то пошло не так... 🤔'],
  ['decline', 'Отклонил(а) вашу заявку в друзья. Возможно, в другой раз? 😟'],
  ['submit', 'Принял(а) вашу заявку в друзья. Время праздновать! 🎉'],
  ['delete', 'Удалил(а) вас из друзей. Вспомним лучшие времена... 💔'],
  ['react_Photo', 'Оценил(а) вашу фоточку. Сильно впечатлен(а)! 💖'],
  ['react_Post', 'Оценил(а) ваш пост. Ну ты даешь! 🌟'],
  ['publish_Photo', 'Опубликовал(а) свою фотку. Просто огонь! 🔥'],
  ['publish_many_Photo', 'Опубликовал(а) несколько фотографий. Настоящий фото-арт! 📸✨'],
  ['publish_Post', 'Опубликовал(а) свой пост. Это будет бомба! 💥'],
]);

const getFrLink = (type: string) => {
  if (type === 'submit' || type === 'delete') return 'friends'
  return 'incoming'
}

const getFrPageLink = (n: FrNotification) => {
  if (['receive', 'abort', 'decline', 'submit', 'delete'].includes(n.type)) {
    return { name: 'friends', query: { tab: getFrLink(n.type) } };
  }

  switch (n.type) {
    case 'react_Photo':
      return n.phId ? { name: 'photos', query: { r: n.phId } } : { name: 'photos' };
    case 'publish_Photo':
      return n.phId ? { name: 'photos-user', params: { uid: n.detail._id }, query: { r: n.phId } } : { name: 'photos-user', params: { uid: n.detail._id } };
    case 'publish_many_Photo':
      return { name: 'photos-user', params: { uid: n.detail._id }};
    case 'react_Post':
    case 'publish_Post':
      return { name: 'photos' };
    default:
      return { name: 'photos' };
  }
}
</script>

<template>

  <div v-if="store.notifications.length || store.notificationsFr.length" class="notification-container">
    <!-- обычные   -->

    <div
        v-for="notification in store.notifications"
        :key="notification.id"
        :class="['notification', notification.type]"
    >
      <v-icon class="icon-type">{{ getIcon(notification.type) }}</v-icon>
      <span>{{ notification.message }}</span>
      <v-btn
          class="ml-auto"
          variant="plain"
          icon="mdi-close"
          @click="store.removeNotification(notification.id)"
      />
    </div>

    <!-- друзья - медиа   -->
    <div
        v-for="n in store.notificationsFr"
        :key="n.id"
        class="notification __fr-ntf"
        @click="store.removeNotification(n.id, 'Fr')"
    >

      <friends-mutual-item class="notification__avatar" :mutual="n.detail" :is-short="true" :is-without-nick="true"/>

      <div class="notification-details">
        <div class="notification-details__nick">
          <router-link
              :style="{color: n.detail.nickname_color ? n.detail.nickname_color : 'currentColor'}"
              class="notification__nick"
              :to="{ name: 'friends-user', params: { id: n.detail._id } }"
          >{{ n.detail.nickname }}
          </router-link>
        </div>

        <div class="notification-details__message">
          {{ frMap.get(n.type)}}
          <router-link class="hide__link" :to="getFrPageLink(n)"/>
        </div>
      </div>

      <router-link class="hide__link" :to="getFrPageLink(n)"/>

      <v-btn
          class="ml-auto notification__btn"
          variant="plain"
          icon="mdi-close"
          @click="store.removeNotification(n.id, 'Fr')"
      />
    </div>
  </div>

</template>

<style scoped>

.notification-container {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 1rem;
  z-index: 10005;

  @media (max-width: 650px) {
    bottom: unset;
    top: 0;
    width: 100%;
    max-width: unset;
  }
}

.__fr-ntf{
  padding: 0 !important;
  position: relative;

  .notification__avatar{
    z-index: 10006;
  }

  .notification-details{
    display: flex;
    flex-direction: column;

    .notification-details__nick{
      width: fit-content;
      z-index: 10006;
      font-weight: 600;
    }

    .notification-details__message{
      position: relative;
      font-size: 14px;
    }
  }

  @media (max-width: 650px) {
    padding: 5px !important;
  }
}

.hide__link{
  position: absolute;
  inset: 0;
}




.icon-type {
  outline: 2px solid currentColor;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 1px 20px currentColor;
  margin-right: 10px;
}

.notification {
  backdrop-filter: blur(15px);
  box-shadow: 0 1px 10px currentColor;
  border: 2px solid currentColor;
  border-radius: 15px;
  padding: 1rem;
  margin-bottom: 15px;
  display: flex;
  gap: 5px;
  align-items: center;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.3s ease forwards;
}


@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notification.success {
  border-color: #4caf50;
  color: #4caf50;
  background: linear-gradient(180deg, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0.1) 100%);
}

.notification.error {
  border-color: #f44336;
  color: #f44336;
  background: linear-gradient(180deg, rgba(244, 67, 54, 0.3) 0%, rgba(244, 67, 54, 0.1) 100%);
}

.notification.warning {
  border-color: orange;
  color: orange;
  background: linear-gradient(180deg, rgba(255, 165, 0, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%);
}

.notification.info {
  border-color: currentColor;
  color: currentColor;
  background: linear-gradient(180deg, rgba(33, 150, 243, 0.3) 0%, rgba(33, 150, 243, 0.1) 100%);
}
</style>
