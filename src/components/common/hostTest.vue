<script setup lang="ts">
import {onMounted, ref} from "vue";
import api from "@/utils/api";

const success = ref<string>('pong')

onMounted(async ()  => {
  try{
    const response = await api.get('/auth/ping')
    success.value = response.data.message;
  }catch(error){
    success.value = '';
    console.info('Деньги на хостинге для API, видимо, закончились :( Если хотите посмотреть проект - свяжитесь: ', 'https://t.me/m0skvitin');
  }
})
</script>

<template>
  <div class="host-test__wrapper" v-if="success !== 'pong'">
    <h2>Деньги на хостинге для API, видимо, закончились :(</h2>
    <div class="d-flex ga-2 align-items-center">
      <h5>Если хотите посмотреть проект - свяжитесь: <a href="https://t.me/m0skvitin" target="_blank">TG</a></h5>
    </div>
  </div>
</template>

<style scoped lang="scss">
.host-test__wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}

</style>