<script setup lang="ts">
import MediaUpload from "@/components/multimedia/mediaUpload.vue";
import {ref} from "vue";
import {useCmStore} from "@/stores/cmStore";
import {useNotificationStore} from "@/stores/notifications";
import CreateMessageText from "@/components/communications/createMessageText.vue";

interface PostF { id: string, file: File, previewUrl?: string, type: string }

const cmStore = useCmStore();
const ntfStore = useNotificationStore();

const showAttachments = ref<boolean>(false);

const msgFiles = ref<PostF[]>([]);
const msgText = ref<string>('');

const handleMsg = async () => {
  if (!msgText.value.trim().length && !msgFiles.value.length) return;
  if (!cmStore.selectedDialogId || !cmStore.messages || !cmStore.messages.length) return;

  let data = new FormData();

  data.append("content", msgText.value.trim());
  data.append("recipient", cmStore.selectedDialogId);
  data.append("chatType", cmStore.messages[0].conversationType === 'PersonalConversation' ? 'personal' : 'group');

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

const actAttachments = () => {
  if (showAttachments.value){
    !msgFiles.value.length ? showAttachments.value = false : false
  }else{
    showAttachments.value = true
  }
}
</script>

<template>
  <div class="create-message__wrapper">
    <media-upload v-if="showAttachments" @sl-post-media="(m: PostF[] | []) => msgFiles = m" sender="message"/>
    <create-message-text @act-attachments="actAttachments" @send-message="handleMsg" v-model="msgText"/>
  </div>
</template>

<style scoped lang="scss">
.create-message__wrapper{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>