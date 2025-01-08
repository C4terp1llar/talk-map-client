<script setup lang="ts">
import CreateComment from "@/components/posts/createComment.vue";

const emit = defineEmits<{
  (e: 'actChangeComment'):void,
  (e: 'commentUpdated', payload: {comment_id: string, newText: string, updated: Date}): void,
}>();

interface Props {
  entityType: 'Publication' | 'Post' | 'Comment',
  entityId: string,
  mode: 'internal' | 'external',
  text: string;
  comment_id: string;
}

const props = defineProps<Props>()
</script>

<template>
  <div class="change-item__text">
    <div class="change-item__close-btn__block">
      <span>Отменить изменение</span>
      <v-icon :size="16">mdi-close</v-icon>
      <button @click="emit('actChangeComment')"></button>
    </div>

    <create-comment @comment-updated="payload => emit('commentUpdated', payload)" :comment_id="props.comment_id" :change-text="props.text" :mode="props.mode"
                    :entity-type="props.entityType" :entity-id="props.entityId" :reply="null"
    />
  </div>
</template>

<style scoped lang="scss">

.change-item__close-btn__block{
  position: relative;
  margin: 0 43px 5px 43px;
  color: orange;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;

  button{
    position: absolute;
    inset: 0;
  }
}
</style>