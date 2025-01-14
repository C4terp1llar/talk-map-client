<script setup lang="ts">
import {ref} from "vue";
import CustomHorizontalTab from "@/components/customHorizontalTab.vue";
import ChangePassword from "@/components/settings/security/changePassword.vue";

const isChangePassVisible = ref<boolean>(false);
</script>

<template>
  <div class="change-password__wrapper">
    <custom-horizontal-tab @act-tab="isChangePassVisible = !isChangePassVisible" :open="isChangePassVisible" text="Изменение пароля"/>

    <change-password v-if="isChangePassVisible"/>
  </div>
</template>

<style scoped>

</style>