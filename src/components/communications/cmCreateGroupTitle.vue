<script setup lang="ts">
import {rules} from "@/helpers/baseTextValidator";
import PassIndicator from "@/components/passIndicator.vue";
import {useNotificationStore} from "@/stores/notifications";
import {computed, ref} from "vue";
import {replaceSymbols} from "@/helpers/replaceSymbols";
import {debounce} from "perfect-debounce";
import {useCmStore} from "@/stores/cmStore";

const emit = defineEmits<{
  (e: 'titleSelect', title: string): void
}>()

const cmStore = useCmStore();

const title = ref<string>('');
const errorMessages = ref<string[]>([]);

const handleInput = () => {
  title.value = replaceSymbols(title.value);
  titleOk.value = null;

  if (!title.value.length || rules.fieldSymbols(title.value) !== true) {
    errorMessages.value = [];
    return
  }else{
    errorMessages.value = [];
    debouncedOperation();
  }
};

const titleOk = ref<boolean | null>(null)

const debouncedOperation = debounce(async () => {
  if (!title.value.length || rules.fieldSymbols(title.value) !== true) return;

  const {match} = await cmStore.checkGroup(title.value)

  titleOk.value = match

  if (!match) {
    errorMessages.value.push('У вас уже существует группа с таким названием');
  }else{
    emit('titleSelect', title.value);
  }
}, 1000);
</script>

<template>
  <div class="cm-create-group-title__wrapper">
    <div class="field">
      <label class="inp-default-label">Название группы:</label>

      <div class="position-relative">
        <v-text-field
            v-model.trim="title"
            :rules="[rules.required, rules.fieldSymbols(title)]"
            variant="outlined"
            @input="handleInput"
            hide-details="auto"
            :error-messages="errorMessages"
        />
        <div class="title-indicator">
          <pass-indicator :pending="cmStore.checkGroupPending" :match="titleOk"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cm-create-group-title__wrapper{
  .title-indicator{
    position: absolute;
    right: 10px;
    top: 0;
  }
}
</style>