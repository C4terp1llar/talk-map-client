<script setup lang="ts">
import {useRoute} from "vue-router";
import {useExternalUserStore} from "@/stores/externalUser";
import {onBeforeMount, onMounted} from "vue";
import {useNotificationStore} from "@/stores/notifications";
import ExternalWallpaper from "@/components/externalFriends/externalWallpaper.vue";
import ExternalWallpaperAvatar from "@/components/externalFriends/externalWallpaperAvatar.vue";
import ExternalTags from "@/components/externalFriends/externalTags.vue";

const route = useRoute()

const externalUserStore = useExternalUserStore();
const notificationStore = useNotificationStore();

onMounted(async () => {
  await externalUserStore.getExternalMainUserInfo(route.params.id);

  if (externalUserStore.error) {
    notificationStore.addNotification('error', externalUserStore.error, 3000)
  }
})
</script>

<template>
  <div class="friends-user-wrapper" >
    <external-wallpaper>
      <external-wallpaper-avatar/>
    </external-wallpaper>

    <external-tags/>
  </div>
</template>

<style scoped lang="scss">
.friends-user-wrapper{
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>