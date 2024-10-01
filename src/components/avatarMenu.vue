<script setup lang="ts">
import {ref} from 'vue';
import {onClickOutside} from "@vueuse/core";
import ThemeSwitcher from "@/components/themeSwitcher.vue";
import {useUserStore} from "@/stores/user";
import {useAuthStore} from "@/stores/auth";
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import LazyPlaceholderLoader from "@/components/common/lazyPlaceholderLoader.vue";

const userStore = useUserStore()
const authStore = useAuthStore()

const isMenuVisible = ref<boolean>(false);
const refAvatarMenu = ref<HTMLDivElement | null>(null);

const clickOutside = () => {
  if (isMenuVisible.value) {
    isMenuVisible.value = !isMenuVisible.value
  }
}

onClickOutside(refAvatarMenu, e => clickOutside())
</script>

<template>
  <div class="avatar-menu" ref="refAvatarMenu">

    <div class="avatar-block" @click="isMenuVisible = !isMenuVisible">
      <v-avatar class="avatar">
        <skeleton-loader v-if="userStore.pending || userStore.avatarPending"/>
        <v-img
            v-else
            class="user-avatar"
            :src="userStore.userAvatar || userStore.mainUserInfo?.avatar"
            alt="Avatar"
        >
          <template v-slot:placeholder>
            <skeleton-loader/>
          </template>
        </v-img>
      </v-avatar>

      <v-icon>{{ isMenuVisible ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
    </div>

    <v-scroll-y-transition>
      <ul class="menu" v-if="isMenuVisible">

        <li class="avatar-prev">
          <v-avatar class="ready-avatar" size="80">
            <skeleton-loader v-if="userStore.pending || userStore.avatarPending"/>
            <v-img
                v-else
                :src="userStore.userAvatar || userStore.mainUserInfo?.avatar"
                alt="Avatar"
            >
              <template v-slot:placeholder>
                <skeleton-loader/>
              </template>
            </v-img>
          </v-avatar>

          <span class="text-span opacity-80">{{ userStore.mainUserInfo?.email }}</span>
          <span class="text-span opacity-80">{{ userStore.mainUserInfo?.nickname }}</span>
        </li>

        <v-divider class="mt-2 mb-2"/>

        <li class="settings">
          <router-link @click="clickOutside" to="/app/settings"/>
          <v-icon>mdi-cog-outline</v-icon>
          <span class="text-span">Настройки</span>
        </li>

        <li class="profile">
          <router-link @click="clickOutside" to="/app/home"/>
          <v-icon>mdi-home-outline</v-icon>
          <span class="text-span">Профиль</span>
        </li>

        <li class="theme-item">
          <div class="text">
            <v-icon>mdi-theme-light-dark</v-icon>
            <span class="text-span">Тема:</span>
          </div>

          <theme-switcher/>
        </li>

        <v-divider class="mt-2 mb-2"/>

        <li>
          <v-btn @click="authStore.logout" variant="outlined" class="text-none w-100">
            <template v-if="authStore.pending">
              <v-progress-circular
                  class="align-self-center"
                  color="green"
                  indeterminate
                  size="small"
              ></v-progress-circular>
            </template>
            <template v-else>
              Выйти
            </template>
          </v-btn>
        </li>
      </ul>
    </v-scroll-y-transition>

  </div>
</template>

<style scoped lang="scss">
.avatar-menu {
  position: relative;
  transition: background-color 0.3s;
  border-radius: 15px;
  display: flex;
  justify-content: flex-end;
}

.avatar-block {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  color: green;

  &:hover {
    .avatar {
      opacity: .8;
    }
  }

  .avatar {
    position: relative;
    border: 2px solid green;
    transition: .3s;
  }
}

.menu {
  min-width: 200px;

  position: absolute;
  right: -25px;
  top: 60px;

  padding: 15px;
  border-radius: 15px;
  list-style-type: none;

  box-shadow: 0 1px 10px currentColor;

  background: rgb(var(--v-theme-background));

  display: flex;
  flex-direction: column;
  gap: 5px;

  z-index: 10000;
}

.settings,
.profile{
  transition: .3s;
  &:hover{
    background-color: rgba(211, 211, 211, 0.25);
  }
}
.settings,
.profile,
.theme-item{
  padding: 10px 5px;
}

.settings, .profile {
  position: relative;
  display: flex;
  gap: 5px;
  align-items: center;

  a {
    position: absolute;
    inset: 0;
    z-index: 10;
  }
}

.theme-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .text {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.avatar-prev {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;

  .ready-avatar {
    position: relative;
    border: 2px solid green;
  }
}

.text-span {
  word-wrap: break-word;
  white-space: normal;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  max-width: 100%;
}
</style>
