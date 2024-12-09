<script setup lang="ts">
const emit = defineEmits(["update:modelValue", "delete-file"]);

interface Props {
  list: { id: string; file: File; previewUrl?: string; type: string }[];
  modelValue: string[];
}

const props = defineProps<Props>();

const handleAppend = (id: string) => {
  const updatedList = props.modelValue.includes(id)
      ? props.modelValue.filter((fileId) => fileId !== id)
      : [...props.modelValue, id];
  emit("update:modelValue", updatedList);
};

const handleDelete = (id: string) => {
  emit("delete-file", id);
};
</script>

<template>
  <div class="control-list__wrapper">
    <ul class="control-list__list styled-scroll">
      <li class="control-list__item" v-for="(file, index) in props.list" :key="file.id">
        <span class="control-list__item-name">
          {{ `${index + 1}) ${file.file.name}` }}
        </span>

        <div class="control-list__item-actions">

          <v-checkbox-btn
              :model-value="props.modelValue.includes(file.id)"
              @click="handleAppend(file.id)"
          />

          <button class="delete-btn" @click="handleDelete(file.id)">
            <v-icon size="small" color="red">mdi-trash-can-outline</v-icon>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.control-list__wrapper {
  width: 100%;

  .control-list__list {
    width: 100%;
    margin: 0;
    padding: 5px 10px 5px 0;
    gap: 2px;
    display: flex;
    flex-direction: column;
    max-height: 200px;
    overflow-y: auto;

    .control-list__item {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      justify-content: space-between;
      padding: 5px;
      transition: 0.3s;
      background-color: rgb(var(--v-theme-background));

      &:hover {
        filter: brightness(0.85);
      }

      .control-list__item-actions {
        display: flex;
        align-items: center;
      }

      .control-list__item-name {
        display: block;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
      }
    }
  }
}

.delete-btn {
  transition: 0.3s;
  opacity: 1;

  &:hover {
    filter: drop-shadow(0 0 3px rgba(255, 0, 0, 0.45));
  }
}
</style>
