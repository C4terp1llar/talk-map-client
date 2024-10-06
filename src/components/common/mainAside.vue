<script setup lang="ts">
import {useRoute} from 'vue-router';
import {computed} from 'vue';

const route = useRoute();

const isActive = (path: string) => computed(() => route.path.includes(`/app/${path}`));
</script>

<template>

  <nav class="navbar">
    <ul class="nav-menu">

      <li :class="{ active: isActive('home').value }">
        <RouterLink to="/app/home"/>
        <v-icon>mdi-home-outline</v-icon>
        <span>Главная</span>
      </li>

      <li :class="{ active: isActive('map').value }">
        <RouterLink to="/app/map"/>
        <v-icon>mdi-map-outline</v-icon>
        <span>Карта</span>
      </li>

      <li :class="{ active: isActive('messenger').value }">
        <RouterLink to="/app/messenger"/>
        <v-icon>mdi-message-outline</v-icon>
        <span>Мессенджер</span>

      </li>

      <li :class="{ active: isActive('friends').value }">
        <RouterLink to="/app/friends"/>
        <v-icon>mdi-account-multiple-outline</v-icon>
        <span>Друзья</span>

      </li>

      <li :class="['mt-auto',{ active: isActive('settings').value}]">
        <RouterLink to="/app/settings"/>
        <v-icon>mdi-cog-outline</v-icon>
        <span>Настройки</span>

      </li>
    </ul>
  </nav>

</template>

<style scoped lang="scss">
.navbar {
  border-radius: 15px;
  padding: 20px;
  margin: 5px;
  box-shadow: 0 1px 10px currentColor;
  display: flex;
  position: sticky;
  top: 5px;
  height: calc(100vh - 10px);
  justify-content: center;

  @media (max-width: 650px) {
    height: auto;
    padding: 20px 0;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    top: unset;
    z-index: 10001;
    background: rgba(255, 255, 255, 0); /* Прозрачный фон */
    backdrop-filter: blur(50px); /* Эффект размытия */
  }
}

.nav-menu {
  display: flex;
  flex-direction: column;
  list-style: none;
  gap: 5px;
  margin: 0;
  height: 100%;
  padding: 0;
  flex-wrap: wrap;

  @media (max-width: 650px) {
    flex-direction: unset;
  }

  li {
    position: relative;
    padding: 15px 20px;
    display: flex;
    gap: 10px;
    align-items: center;
    transition: background-color 0.3s;
    border-radius: 15px;
    outline-color: rgba(76, 175, 80, 0.3);

    @media (max-width: 650px) {
      padding: 5px 10px;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    &.active {
      background-color: rgba(76, 175, 80, 0.3);
      color: green;
    }

    a {
      position: absolute;
      inset: 0;
      z-index: 10;
    }

    span {
      @media (max-width: 1000px) {
        display: none;
      }
    }
  }
}

</style>
