<script setup lang="ts">
import ThemeSwitcher from "@/components/themeSwitcher.vue";
import {useAuthStore} from "@/stores/auth";
import {useRouter} from "vue-router";

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
  await authStore.logout();
  await router.push('/login')
}
</script>

<template>
  <h1>settings</h1>
  <theme-switcher/>
  <v-btn
    @click="logout"
  >logout</v-btn>
</template>

<style scoped>

</style>