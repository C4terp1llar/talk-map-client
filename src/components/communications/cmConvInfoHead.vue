<script setup lang="ts">
import SkeletonLoader from "@/components/common/skeletonLoader.vue";

interface CmConvHeadData{
  _id: string,
  cover: string,
  title:  string,
  titleColor: string | null,
  type: string,
  opponent?: string
}

interface Props{
  data: CmConvHeadData
}
const props = defineProps<Props>()
</script>

<template>
  <div class="cm-conv-info__head">
    <div class="head__cover">
      <v-avatar :size="150">
        <v-img
            :src="data?.cover"
            alt="conversation cover"
            cover
        >
          <template v-slot:placeholder>
            <skeleton-loader/>
          </template>
        </v-img>
      </v-avatar>
    </div>
    <div class="head__title">
      <h4 v-if="!data.opponent" class="nickname __no-wrap-txt mt-2">{{ data?.title }}</h4>
      <router-link v-else :to="{ name: 'friends-user', params: { id: data.opponent } }">
        <h4 :style="{color: data?.titleColor ? data?.titleColor : 'currentColor'}" class="nickname __no-wrap-txt mt-2">{{ data?.title }}</h4>
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cm-conv-info__head{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>