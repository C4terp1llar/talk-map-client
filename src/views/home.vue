<script setup lang="ts">
import apiAuth from "@/utils/apiAuth";

const test = async () => {
  try{
    const response = await apiAuth.post('auth/test')
    console.log(response)
  }catch(err){
    console.log(err)
  }

}
</script>

<template>
  <h1>home</h1>
  <h1>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam aperiam dolores ducimus expedita hic impedit incidunt ipsa vel veritatis voluptates! Accusamus, aliquid at atque blanditiis corporis culpa deleniti dolore eaque esse exercitationem expedita explicabo ipsa laudantium molestiae placeat porro quae totam! Aspernatur error impedit nisi quidem reiciendis? Corporis deserunt nulla odio reprehenderit vel! Dolor eligendi enim inventore ipsum, itaque nihil praesentium rerum. Aut autem corporis cum cupiditate dolor enim error necessitatibus nesciunt, nostrum, perferendis quibusdam soluta veniam voluptate. Assumenda dolor dolorum ea earum eum expedita explicabo in laborum mollitia nemo neque odit omnis praesentium, rem reprehenderit repudiandae sint voluptate voluptates.</h1>
  <v-btn @click="test">test</v-btn>
</template>

<style scoped>

</style>