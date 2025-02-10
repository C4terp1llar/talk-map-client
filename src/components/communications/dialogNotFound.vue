<script setup lang="ts">
import {useRouter} from "vue-router";

interface Props {
  newDialogMode?: boolean
}

defineProps<Props>()

const router = useRouter();
</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <h6>Диалог не найден 😨</h6>
    <v-btn variant="outlined" class="text-none" @click="router.back()">Назад</v-btn>
  </div>
</template>

<style scoped lang="scss">

</style>