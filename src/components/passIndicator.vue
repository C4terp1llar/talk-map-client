<script setup lang="ts">
//alert-circle-outline
//mdi-check-circle-outline
//help-circle-outline
import {useRegistrationStore} from "@/stores/regSteps";
import {useSecurityStore} from "@/stores/security";

interface Props{
  match: boolean | null
}
defineProps<Props>()

const secureStore = useSecurityStore();
</script>

<template>
  <div class="indicator-wrapper">
    <v-progress-circular
        v-if="secureStore.checkPending"
        size="15"
        indeterminate
        color="green"
    ></v-progress-circular>
    <v-icon class="icon" v-if="!secureStore.checkPending && typeof match === 'boolean'" :color="!match ? 'red' : 'green'">
      <template v-if="!match">
        mdi-alert-circle-outline
      </template>
      <template v-if="match">
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
  justify-content: center;
  .icon{
    font-size: 15px;
  }
}
</style>