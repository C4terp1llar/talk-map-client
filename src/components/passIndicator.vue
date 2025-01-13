<script setup lang="ts">
//alert-circle-outline
//mdi-check-circle-outline
//help-circle-outline
import {useRegistrationStore} from "@/stores/regSteps";

const registrationStore = useRegistrationStore();
</script>

<template>
  <div class="indicator-wrapper">
    <v-progress-circular
        v-if="registrationStore.nicknamePending"
        size="15"
        indeterminate
        color="green"
    ></v-progress-circular>
    <v-icon class="icon" v-else :color="registrationStore.isNicknameTaken === 'true' ? 'red' : 'green'">
      <template v-if="registrationStore.isNicknameTaken === 'true'">
        mdi-alert-circle-outline
      </template>
      <template v-if="registrationStore.isNicknameTaken === 'false'">
        mdi-check-circle-outline
      </template>
    </v-icon>
  </div>
</template>

<style scoped>
.indicator-wrapper{
  height: 56px;
  display: flex;
  align-items: center;
  .icon{
    font-size: 15px;
  }
}
</style>