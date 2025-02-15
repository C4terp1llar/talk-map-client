<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed} from "vue";

interface Props {
  convId: string,
  convType: string,
}

const props = defineProps<Props>()

type Tab = 'image' | 'video' | 'files' | 'group';

const router = useRouter();
const route = useRoute();

const activeTab = computed(() => route.query.tab as Tab || (props.convType === 'group' ? 'group' : 'image'))
</script>

<template>
  <div class="wrapper-settings-tabs__main">
    <v-tabs
        class="tabs"
        slider-color="green"
        align-tabs="center"
        show-arrows
        :model-value="activeTab"
    >
      <v-tab
          v-if="convType === 'group'"
          class="text-none"
          prepend-icon="mdi-account-group-outline"
          @click="router.push({ query: {...route.query, tab: 'group' } })"
          value="group"
      >
        Группа
      </v-tab>
      <v-tab
          class="text-none"
          prepend-icon="mdi-image"
          @click="router.push({ query: {...route.query, tab: 'image' } })"
          value="image"
      >
        Фото
      </v-tab>
      <v-tab
          class="text-none"
          prepend-icon="mdi-movie-open-outline"
          @click="router.push({ query: {...route.query, tab: 'video' } })"
          value="video"
      >
        Видео
      </v-tab>
      <v-tab
          class="text-none"
          prepend-icon="mdi-file-multiple-outline"
          @click="router.push({ query: {...route.query, tab: 'files' } })"
          value="files"
      >
        Файлы
      </v-tab>
    </v-tabs>
  </div>
</template>

<style scoped lang="scss">
.wrapper-settings-tabs__main  {
  width: 100%;
  display: grid;

  .tabs {
    height: auto;
    padding: 5px 0;
    border-radius: 10px;
    border: 1px solid grey;
  }
}
</style>