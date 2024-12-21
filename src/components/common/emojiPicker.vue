<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import {processedEmojiData} from "@/helpers/emojiData";

const emit = defineEmits();

interface Props {
  selectMode: 'single' | 'multiple',
  isRelative?: boolean
}
const props = defineProps<Props>();

const emojiWrapperRef = ref<HTMLElement | null>(null);

const scrollToSection = (slug: string) => {
  const element = document.getElementById(slug);
  if (element && emojiWrapperRef.value) {
    const container = emojiWrapperRef.value;
    const elementPosition = element.offsetTop;
    container.scrollTo({
      top: elementPosition - 80,
      behavior: 'smooth',
    });
  }
};

const handleSelect = (emoji: string) => {
  emit('select', emoji);
  if (props.selectMode === 'single') {
    emit('close');
  }
};

const clickOutside = () => {
  emit('close');
};
onClickOutside(emojiWrapperRef, clickOutside);
</script>

<template>
  <div :class="['emoji-wrapper', props.isRelative ? '__relative' : '']" ref="emojiWrapperRef">
    <div class="emoji-wrapper__tabs">
      <div class="emoji-wrapper__tab" v-for="obj in processedEmojiData" :key="obj.slug">
        <i :class="['emoji-wrapper__tab-icon', 'mdi', obj.iconClass]"></i>
        <button @click="scrollToSection(obj.slug)"></button>
      </div>
    </div>
    <div class="emoji-wrapper__content" v-for="obj in processedEmojiData" :key="obj.slug">
      <div class="emoji-wrapper__content-divider"></div>
      <ul class="emoji-wrapper__content-emojis" :id="obj.slug">
        <li class="emoji-wrapper__content-emojis__item" v-for="subObj in obj.emojis" :key="subObj.slug">
          <div class="item__icon">{{ subObj.emoji }}</div>
          <button @click="handleSelect(subObj.emoji)"></button>
        </li>
      </ul>
    </div>
  </div>
</template>


<style scoped lang="scss">

.emoji-wrapper__tabs{
  z-index: 9990;
  position: sticky;
  top: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 20px 0 10px 0;

  background-color: rgb(var(--v-theme-background));

  @media screen and (max-width: 350px) {
    gap: 5px;
  }
  @media screen and (max-width: 320px) {
    gap: 2px;
  }

  .emoji-wrapper__tab{
    position: relative;
    transition: .2s;
    &:hover{
      color: green !important;
    }

    .emoji-wrapper__tab-icon{
      font-size: 24px;
      display: block;
      @media (max-width: 400px) {
        font-size: 20px ;
      }
    }

    button{
      position: absolute;
      inset: 0;
    }
  }
}

.__relative{
  max-width: unset !important;
  width: 100%;
  max-height: 100px;

  .emoji-wrapper__tabs{
    padding: 0 !important;
  }
}

.emoji-wrapper {
  z-index: 9980;

  background-color: rgb(var(--v-theme-background));
  font-family: "Noto Color Emoji", sans-serif;

  box-shadow: 0 0 10px currentColor;
  border-radius: 15px;

  max-width: 330px;
  height: 400px;
  padding: 0 10px 10px 10px;

  overflow-y: auto;

  @media (max-width: 350px) {
    margin: 5px;
  }

  .emoji-wrapper__content-divider{
    width: 90%;
    height: 2px;
    margin: 5px auto;
    background: currentColor;
    opacity: .5;
  }

  .emoji-wrapper__content-emojis{
    padding: 0;
    margin: 0;
    list-style-type: none;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;


    .emoji-wrapper__content-emojis__item{
      position: relative;
      border-radius: 5px;
      transition: .2s;
      &:hover{
        background-color: rgba(136, 136, 136, 0.35);
      }

      .item__icon{
        font-size: 20px;
        padding: 5px;
      }

      button{
        position: absolute;
        inset: 0;
      }
    }
  }
}

.emoji-wrapper::-webkit-scrollbar {
  width: 8px;
  margin-right: 5px;
}

.emoji-wrapper::-webkit-scrollbar-thumb {
  background-color: #c4c4c4;
  border-radius: 15px;
}

.emoji-wrapper::-webkit-scrollbar-track {
  margin: 10px;
  background: #777777;
  border-radius: 15px;
}
</style>