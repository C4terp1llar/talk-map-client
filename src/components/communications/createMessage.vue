<script setup lang="ts">
import MediaUpload from "@/components/multimedia/mediaUpload.vue";
import {onUnmounted, ref, watch} from "vue";
import {useCmStore} from "@/stores/cmStore";
import {useNotificationStore} from "@/stores/notifications";
import CreateMessageText from "@/components/communications/createMessageText.vue";
import type {FullMessage, ShortUserInfo, UploadMediaFile} from "@/helpers/interfaces";
import {useRouter} from "vue-router";

interface Props {
  newConvMode?: boolean;
  newDialogOpponent?: ShortUserInfo;
  changeData?: {
    attaches: UploadMediaFile[] | [],
    message: FullMessage
  };
}

const props = defineProps<Props>();

const router = useRouter()

const cmStore = useCmStore();
const ntfStore = useNotificationStore();

const showAttachments = ref<boolean>(false);

const msgFiles = ref<UploadMediaFile[]>([]);
const msgText = ref<string>('');

let tempMsgChangeAttachments: null | string | UploadMediaFile[] = null

watch(
    () => props.changeData,
    (newData) => {
      if (newData) {
        msgText.value = newData.message.content || '';
        msgFiles.value = newData.attaches || [];
        showAttachments.value = msgFiles.value.length > 0;
        tempMsgChangeAttachments = newData.attaches;
      }else{
        showAttachments.value = false;
        msgText.value = '';
        msgFiles.value = [];
        tempMsgChangeAttachments = null
      }
    },
    { immediate: true }
);

const handleMsg = async () => {
  if (!msgText.value.trim().length && !msgFiles.value.length) return;

  if (props.newConvMode && props.newDialogOpponent) {
    await handleNewMsg()
    return
  }

  if (props.changeData && (props.changeData.message.content === msgText.value.trim() && JSON.stringify(tempMsgChangeAttachments) === JSON.stringify(msgFiles.value))) {
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
    if (props.changeData && JSON.stringify(tempMsgChangeAttachments) !== JSON.stringify(msgFiles.value)){
      msgFiles.value.forEach(fileEntry => {
        data.append(fileEntry.file.name, fileEntry.file);
      });
    }else if (!props.changeData ){
      msgFiles.value.forEach(fileEntry => {
        data.append(fileEntry.file.name, fileEntry.file);
      });
    }
  }

  if (props.changeData){
    await cmStore.changeMsg(data, props.changeData.message._id);
  }else{
    await cmStore.createMsg(data);
  }

  if (cmStore.error){
    ntfStore.addNotification('error', cmStore.error, 3000)
  }else{
    if (props.changeData){
      cmStore.changeMsgData = null;
      tempMsgChangeAttachments = null;
      await cmStore.changeMsgReload();
    }else{
      await successSendMessage()
    }
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
    cmStore.selectedDialogId = newConvData.conversation_id
    cmStore.newPersonalConvOpponentUid = null
    cmStore.newDialogOpponent = null
    await cmStore.getConversations(1, 30)
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
  msgText.value = '.'
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

const updateMedia = (newMedia: UploadMediaFile[] | []) => {
  msgFiles.value = newMedia
}

onUnmounted(() => tempMsgChangeAttachments = null)
</script>

<template>
  <div class="create-message__wrapper">
    <media-upload v-if="showAttachments" :preload-files="msgFiles" @sl-post-media="m => updateMedia(m)" sender="message"/>
    <create-message-text @act-attachments="actAttachments" :mode="changeData ? 'change' : 'default'" @send-message="handleMsg" v-model="msgText"/>
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