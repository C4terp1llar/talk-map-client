<script setup lang="ts">
import type {FullMessage, PersonalConv} from "@/helpers/interfaces";
import CreateMessage from "@/components/communications/createMessage.vue";

interface Props {
  messages: FullMessage[]
}

const props = defineProps<Props>()
</script>

<template>
  <div class="cm-message-list__wrapper">
    <div class="cm-message-list__content">

    </div>
    <create-message/>
  </div>
</template>

<style scoped lang="scss">
.cm-message-list__wrapper{

}
</style>