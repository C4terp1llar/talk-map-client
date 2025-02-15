<script setup lang="ts">
import CmConvInfoTabs from "@/components/communications/cmConvInfoTabs.vue";
import {useRoute} from "vue-router";
import {type Component, computed} from "vue";
import CmConvInfoDataImage from "./cmConvInfoDataImage.vue";
import CmConvInfoDataVideo from "./cmConvInfoDataVideo.vue";
import CmConvInfoDataFiles from "./cmConvInfoDataFiles.vue";
import CmConvInfoDataGroup from "./cmConvInfoDataGroup.vue";

interface Props {
  convId: string,
  convType: string,
}

const props = defineProps<Props>()

type Tab = 'image' | 'video' | 'files' | 'group';

const route = useRoute();

const activeTab = computed(() => route.query.tab as Tab || (props.convType === 'group' ? 'group' : 'image'))

const componentsMap: Record<Tab, Component> = {
  image: CmConvInfoDataImage,
  video: CmConvInfoDataVideo,
  files: CmConvInfoDataFiles,
  group: CmConvInfoDataGroup
};
</script>

<template>
  <div class="cm-conv-info-data__wrapper">

    <div class="cm-conv-info-data__content">
      <cm-conv-info-tabs :conv-id="convId" :conv-type="convType"/>

      <component :is="componentsMap[activeTab]" />
    </div>

  </div>
</template>

<style scoped lang="scss">
.cm-conv-info-data__wrapper {
  height: 100%;
  width: 100%;
  padding: 0 5px 5px 5px;
  display: grid;
  .cm-conv-info-data__content{

  }
}
</style>