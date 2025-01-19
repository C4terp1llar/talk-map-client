<script setup lang="ts">
import {ref} from "vue";

const q = ref<string>('')

const handleSearch = () => {

}
</script>

<template>
  <div class="sm-sidebar-list-search__wrapper">
    <v-text-field
        v-model="q"
        variant="outlined"
        @keydown.enter="handleSearch"
        hide-details
        placeholder="Поиск"
        :append-inner-icon="!q ? 'mdi-magnify' : 'mdi-close'"
        @click:append-inner="q = ''"
    />
  </div>
</template>

<style scoped lang="scss">

</style>