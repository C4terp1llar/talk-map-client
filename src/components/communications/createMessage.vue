<script setup lang="ts">
import MediaUpload from "@/components/multimedia/mediaUpload.vue";
import {ref} from "vue";
import {useCmStore} from "@/stores/cmStore";
import {useNotificationStore} from "@/stores/notifications";
import CreateMessageText from "@/components/communications/createMessageText.vue";
import type {FullMessage, PersonalConv, ShortUserInfo} from "@/helpers/interfaces";
import {useRouter} from "vue-router";

interface Props {
  newConvMode?: boolean;
  newDialogOpponent?: ShortUserInfo
}

const props = defineProps<Props>();

interface PostF { id: string, file: File, previewUrl?: string, type: string }

const router = useRouter()

const cmStore = useCmStore();
const ntfStore = useNotificationStore();

const showAttachments = ref<boolean>(false);

const msgFiles = ref<PostF[]>([]);
const msgText = ref<string>('');

const handleMsg = async () => {
  if (!msgText.value.trim().length && !msgFiles.value.length) return;

  if (props.newConvMode && props.newDialogOpponent) {
    console.log('qwe')
    await handleNewMsg()
    return
  }

  if (!cmStore.selectedDialogId || !cmStore.selectedDialog || !cmStore.messages || !cmStore.messages.length) return;

  let data = new FormData();

  data.append("content", msgText.value.trim());
  data.append("convId", cmStore.selectedDialogId);
  data.append("chatType", cmStore.messages[0].conversationType === 'PersonalConversation' ? 'personal' : 'group');

  if ("opponent" in cmStore.selectedDialog) {
    data.append("recipient", cmStore.selectedDialog.opponent._id);
  }

  if (msgFiles.value.length > 0){
    msgFiles.value.forEach(fileEntry => {
      data.append(fileEntry.file.name, fileEntry.file);
    });
  }

  await cmStore.createMsg(data);

  if (cmStore.error){
    ntfStore.addNotification('error', cmStore.error, 3000)
  }else{
    await successSendMessage()
  }

}

const handleNewMsg = async () => {
  if (!props.newConvMode || !props.newDialogOpponent) return;

  let data = new FormData();

  data.append("content", msgText.value.trim());
  data.append("chatType", 'personal');
  data.append("recipient", props.newDialogOpponent._id);

  if (msgFiles.value.length > 0){
    msgFiles.value.forEach(fileEntry => {
      data.append(fileEntry.file.name, fileEntry.file);
    });
  }

  const newConvData = await cmStore.createMsg(data);

  if (cmStore.error){
    ntfStore.addNotification('error', cmStore.error, 3000)
  }else if (newConvData && !cmStore.error){
    await router.push({query: {conv: newConvData.conversation_id}})
  }
}

const actAttachments = () => {
  if (showAttachments.value){
    !msgFiles.value.length ? showAttachments.value = false : false
  }else{
    showAttachments.value = true
  }
}

const clearFields = () => {
  showAttachments.value = false
  showAttachments.value = false
  msgFiles.value = []
  msgText.value = ''
}

const successSendMessage = async () => {
  if (!cmStore.selectedDialogId || !cmStore.selectedDialog || !cmStore.messages || !cmStore.messages.length || !cmStore.conversations || !cmStore.conversations.length) return;
  clearFields();

  const [dialog] = await Promise.all([
    cmStore.getDialogInfo(cmStore.selectedDialogId, true, true),
    cmStore.getMessages(cmStore.selectedDialogId, 1 ,200 , true)
  ])

  if (dialog) {
    const index = cmStore.conversations.findIndex((conv) => conv._id === cmStore.selectedDialogId);

    if (index !== -1) {
      cmStore.conversations.splice(index, 1);
      cmStore.conversations.unshift(dialog);
    } else {
      cmStore.conversations.unshift(dialog);
    }
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