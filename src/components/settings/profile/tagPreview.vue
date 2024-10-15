<script setup lang="ts">
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()
</script>

<template>

    <div class="tag-review__content-wrapper">
      <div class="tag-review__content">
        <div class="emoji emoji-font">{{userStore.newTagEmoji || '🌎'}}</div>
        <span class="tag-text">{{userStore.newTagText || 'Напишите что-нибудь'}}</span>
      </div>
    </div>

</template>

<style scoped lang="scss">
.tag-review__content-wrapper{
  padding: 2px;
  border-radius: 25px;
  width: fit-content;
  background: linear-gradient(
      90deg,
      red,
      orange,
      yellow,
      green,
      blue,
      indigo,
      violet
  );
  filter: drop-shadow(0 0 3px currentColor);
  .tag-review__content{
    width: fit-content;
    border-radius: 25px;
    display: flex;
    gap: 5px;
    padding: 5px 10px;
    background-color: rgb(var(--v-theme-background));

    align-items: center;
  }
}

.tag-text{
  font-weight: 600;
  font-size: 14px;
}
</style>