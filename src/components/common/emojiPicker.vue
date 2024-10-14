<script setup lang="ts">
import emojiData from 'unicode-emoji-json/data-by-group.json';

const categoriesIcons = {
  smileys_emotion: 'mdi-emoticon-happy-outline',
  people_body: 'mdi-human-greeting-variant',
  animals_nature:'mdi-fishbowl-outline',
  food_drink:'mdi-food-apple-outline',
  travel_places:'mdi-train-car',
  activities:'mdi-airplane',
  objects:'mdi-ufo-outline',
  symbols:'mdi-wheelchair',
  flags:'mdi-flag-outline',
}

</script>

<template>
  <div class="emoji-wrapper">
    <div class="emoji-wrapper__tabs">
      <div class="emoji-wrapper__tab" v-for="obj in emojiData" :key="obj.slug">
        <a :href="`#${obj.slug}`"></a>
        <i :class="['emoji-wrapper__tab-icon','mdi', categoriesIcons[obj.slug]]"></i>
      </div>
    </div>
    <div class="emoji-wrapper__content" v-for="obj in emojiData" :key="obj.slug">
      <div class="emoji-wrapper__content-divider"></div>
      <ul class="emoji-wrapper__content-emojis" :id="obj.slug">
        <li class="emoji-wrapper__content-emojis__item" v-for="subObj in obj.emojis" :key="subObj.slug">
          <div class="item__icon" v-if="subObj.emoji.length === 2">{{ subObj.emoji }}</div>
          <button></button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">

.emoji-wrapper__tabs{
  z-index: 10004;
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
  @media screen and (max-width: 300px) {
    gap: 2px;
  }

  .emoji-wrapper__tab{
    position: relative;

    .emoji-wrapper__tab-icon{
      font-size: 24px;
      display: block;
      @media (max-width: 350px) {
        font-size: 20px ;
      }
    }

    a{
      position: absolute;
      inset: 0;
    }
  }
}

.emoji-wrapper {
  scroll-padding-top: 80px;

  z-index: 10003;
  position: absolute;

  background-color: rgb(var(--v-theme-background));
  font-family: "Noto Color Emoji", sans-serif;

  box-shadow: 0 0 10px currentColor;
  border-radius: 15px;

  max-width: 330px;
  height: 400px;
  padding: 0 10px 10px 10px;

  overflow-y: scroll;
  scroll-behavior: smooth;

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

      .item__icon{
        font-size: 20px;
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