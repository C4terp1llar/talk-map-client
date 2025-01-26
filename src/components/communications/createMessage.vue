<script setup lang="ts">
import MediaUpload from "@/components/multimedia/mediaUpload.vue";
import {ref} from "vue";
import {useCmStore} from "@/stores/cmStore";
import {useNotificationStore} from "@/stores/notifications";

interface PostF { id: string, file: File, previewUrl?: string, type: string }

const cmStore = useCmStore();
const ntfStore = useNotificationStore();

const msgFiles = ref<PostF[]>([]);
const msgText = ref<string>('');

const handleMsg = async () => {
  if (!msgText.value.trim().length && !msgFiles.value.length) return;

  let data = new FormData();

  data.append("content", msgText.value.trim());
  data.append("recipient", '671a46cedbe33a4302032e96');
  data.append("chatType", 'personal');

  // data.append("convId", msgText.value.trim());
  // data.append("replyTo", msgText.value.trim());


  if (msgFiles.value.length > 0){
    msgFiles.value.forEach(fileEntry => {
      data.append(fileEntry.file.name, fileEntry.file);
    });
  }

  await cmStore.createMsg(data);

  if (cmStore.error){
    ntfStore.addNotification('error', cmStore.error, 3000)
  }
}

</script>

<template>
  <div class="create-message__wrapper">
    <media-upload @sl-post-media="(m: PostF[] | []) => msgFiles = m" sender="message"/>
    <v-text-field variant="outlined" v-model="msgText"/>

    <v-btn @click="handleMsg">go</v-btn>
  </div>
</template>

<style scoped lang="scss">
.create-message__wrapper{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>