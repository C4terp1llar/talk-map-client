<script setup lang="ts">
import SkeletonLoader from "@/components/common/skeletonLoader.vue";
import type {Post, PostOwner} from "@/helpers/interfaces";
import PostHeadActions from "@/components/posts/postHeadActions.vue";

const emit = defineEmits(['deletePost'])

interface Props {
  post: Post,
  postOwnerInfo: PostOwner;
  mode: 'internal' | 'external';
  isGlobal?: boolean;
}

const props = defineProps<Props>();

</script>

<template>
<div class="post-item__head">

  <div class="owner__info ">
    <v-avatar class="post-owner__avatar">
      <v-img :src="postOwnerInfo?.avatar" alt="avatar" cover>
        <template v-slot:placeholder>
          <skeleton-loader/>
        </template>
        <router-link :class="props.mode === 'internal' ? '__non-action' : ''" :to="{ name: 'friends-user', params: { id: postOwnerInfo?._id } }"/>
      </v-img>
    </v-avatar>

    <div class="post-owner__nickname">
      <router-link
          :style="{color: postOwnerInfo?.nickname_color ? postOwnerInfo?.nickname_color : 'currentColor'}"
          :class="['nickname-txt', props.mode === 'internal' ? '__non-action' : '']"
          :to="{ name: 'friends-user', params: { id: postOwnerInfo?._id } }"
      >
        {{ postOwnerInfo?.nickname }}
      </router-link>
    </div>
  </div>

  <post-head-actions @deletePost="emit('deletePost')" :mode="props.mode" :post="props.post" :post-owner-info="props.postOwnerInfo" :is-global="props.isGlobal"/>
</div>
</template>

<style scoped lang="scss">
.post-item__head{
  display: flex;
  align-items: center;
  justify-content: space-between;

  .owner__info{
    display: flex;
    gap: 10px;
    align-items: center;
  }

}

.post-owner__avatar{
  a {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    z-index: 1 !important;
  }
}

.nickname-txt {
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-height: 1.2em;
}



.__non-action{
  pointer-events: none;
}
</style>