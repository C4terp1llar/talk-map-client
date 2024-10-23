<script setup lang="ts">
import {useExternalUserStore} from "@/stores/externalUser";

const externalStore = useExternalUserStore();

</script>

<template>
  <div class="tags-wrapper">

    <div
        class="tag-content-wrapper"
        v-for="tag in externalStore.main?.tags"
        :key="tag.text"
    >
      <div class="tag-content">
        <div class="emoji emoji-font">{{ tag.emoji }}</div>
        <span class="tag-text">{{ tag.text }}</span>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.tags-wrapper {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.tag-content-wrapper {
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

  .tag-content {
    width: fit-content;
    border-radius: 25px;
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 5px 10px;
    background-color: rgb(var(--v-theme-background));
  }
}

.tag-text {
  font-weight: 600;
  font-size: 14px;
}
</style>