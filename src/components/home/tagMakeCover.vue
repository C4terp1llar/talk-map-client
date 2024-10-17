<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter()
</script>

<template>
  <div class="tag-make-cover">
    <div class="tag-make-cover__content">
      <h5 class="ma-0">Добавить тег</h5>
      <v-icon class="icon-tag-cover">mdi-tag-heart-outline</v-icon>
      <button @click="router.push({name: 'settings-profile'})"></button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tag-make-cover{
  width: 100%;
  background: linear-gradient(
      150deg,
      red,
      orange,
      yellow,
      green,
      blue,
      indigo,
      violet
  );
  padding: 2px;
  border-radius: 15px;
  position: relative;
  overflow: hidden;

  .tag-make-cover__content{
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 10px;
    align-items: center;
    width: 100%;
    background-color: rgb(var(--v-theme-background));
    border-radius: 13px;

    transition: .3s;

    .icon-tag-cover, h5{
      transition: .3s;

    }

    &:hover{
      filter: brightness(0.95);
      .icon-tag-cover, h5{
        filter: drop-shadow(0 0 3px currentColor);
      }
    }
  }

  button{
    position: absolute;
    inset: 0;
  }
}

</style>