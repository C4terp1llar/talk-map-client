<script setup lang="ts">
import type {MediaConvInfo} from "@/helpers/interfaces";
import {getFileSize} from "../../../helpers/getFileSize";

interface Props {
  m: MediaConvInfo;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="file-item__wrapper">
    <div class="item__download">
      <v-icon>mdi-download</v-icon>
      <a :href="m.store_url" target="_blank"></a>
    </div>
    <span class="file__name">{{ m.client_filename }}</span>
    <div class="file__size"><span>{{getFileSize(m.client_file_size)}}</span></div>
  </div>
</template>

<style scoped lang="scss">
.file-item__wrapper {
  border: 1px solid grey;
  border-radius: 5px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 5px;

  .item__download {
    position: relative;
    padding: 5px;
    margin-right: 10px;
    border-radius: 50%;
    border: 1px solid lightgrey;
    transition: .3s;

    &:hover {
      background-color: #7777;
    }

    a {
      position: absolute;
      inset: 0;
    }
  }

  .file__size{
    margin-left: 10px;
    font-size: 12px;
    font-weight: 600;
  }
}

.file__name {
  font-size: 13px;
  text-align: left;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
</style>