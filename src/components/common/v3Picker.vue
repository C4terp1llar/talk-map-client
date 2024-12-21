<script setup lang="ts">
import EmojiPicker, {type EmojiExt} from "vue3-emoji-picker";
import 'vue3-emoji-picker/css';
import {onClickOutside} from "@vueuse/core";
import {ref} from "vue";

interface Props{
  isShort?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits(['select', 'close'])

const groupNames = {
  recently_used: 'Недавние',
  smileys_people: "Смайлы и люди",
  animals_nature: "Природа",
  food_drink: "Еда и напитки",
  activities: "Занятия",
  travel_places: "Путешествия и места",
  objects: "Объекты",
  symbols: "Символы",
  flags: "Флаги",
};
const emojiWrapperRef = ref<HTMLElement | null>(null);

const clickOutside = () => {
  emit('close');
};
onClickOutside(emojiWrapperRef, clickOutside);

</script>

<template>
  <emoji-picker
      :class="['em-picker', props.isShort ? '__sh-height' : '']"
      ref="emojiWrapperRef"
      native
      disable-skin-tones
      hide-search
      disable-sticky-group-names
      :group-names="groupNames"
      :disabled-groups="['flags']"
      :static-texts="{ placeholder: 'Поиск эмодзи'}"
      @select="(emoji: EmojiExt) => emit('select', emoji)"
  />
</template>

<style scoped lang="scss">
.em-picker{
  &.__sh-height{
    max-height: 200px;

  }
}
</style>