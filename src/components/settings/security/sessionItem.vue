<script setup lang="ts">
import type { UserSession } from "@/helpers/interfaces";
import {UAParser} from "ua-parser-js";
import { formatShortDate } from "@/helpers/dateHelper";
import {computed, onMounted, ref} from "vue";
import {useSecurityStore} from "@/stores/security";
import {useNotificationStore} from "@/stores/notifications";

const secureStore = useSecurityStore()
const notificationStore = useNotificationStore();

interface Props {
  session: UserSession;
  mode?: "active" | "other";
}

const props = withDefaults(defineProps<Props>(), {
  mode: "other",
});

const emit = defineEmits(['reloadSessions'])

const formattedSession = ref<{browser: string, browser_v: string, os: string, locale: string, created: string} | null>(null);

onMounted(() => formattedSession.value = formatSession())

const formatSession = () :{browser: string, browser_v: string, os: string, locale: string, created: string} => {
  const { device, created } = props.session;

  const [userAgent, locale] = device.split("&");
  const parser = new UAParser(userAgent);
  const browserName = parser.getBrowser().name || "Неизвестный браузер";
  const browserVersion = parser.getBrowser().version || "";
  const osName = parser.getOS().name || "Неизвестная ОС";
  const osVersion = parser.getOS().version || "";

  const formattedDate = formatShortDate(new Date(created));

  return {
    browser: `${browserName}`.trim(),
    browser_v: `${browserVersion}`.trim(),
    os: `${osName} ${osVersion}`.trim(),
    locale: locale.split('-')[0] || "Неизвестная локаль",
    created: formattedDate,
  };
}

const currentPending = ref<string | null>(null);

const deleteSession = async () => {
  currentPending.value = props.session._id
  await secureStore.deleteSession(props.session._id)
  currentPending.value = null

  if (secureStore.delError) {
    notificationStore.addNotification('error', secureStore.delError, 3000)
  }else{
    emit('reloadSessions')
    notificationStore.addNotification('success', 'Сессия успешно завершена!', 3000)
  }
}
</script>

<template>
  <div class="sessions-list__wrapper mt-1 mb-1" v-if="formattedSession">
    <span>
      <strong>Браузер: </strong> {{ formattedSession.browser }}
      <strong>версия: </strong> {{ formattedSession.browser_v }}
    </span>
    <span><strong>ОС: </strong> {{ formattedSession.os }}</span>
    <span><strong class="mr-1">Локаль: </strong> <i :class="`flag fi fi-${formattedSession.locale}`"></i></span>
    <span class="ml-auto create__date">{{ formattedSession.created }}</span>

    <button
        @click="deleteSession"
        :disabled="secureStore.delPending"
        v-if="mode !== 'active'"
        :class=" {'blinking__pending': currentPending === session._id}"
    >
      <v-icon :size="20">mdi-close</v-icon>
    </button>
  </div>
</template>

<style scoped lang="scss">
.sessions-list__wrapper {
  display: flex;
  flex-direction: column;
  padding: 5px;
  border-radius: 15px;
  border: 1px solid currentColor;
  position: relative;

  strong, span{
    font-size: 12px;
  }

  button{
    position: absolute;
    right: 2px;
    top: 2px;
    transition: .3s;
    color: #f44336;
    padding: 5px;

    &:hover{
      filter: drop-shadow(0 0 5px currentColor);
    }
  }
}

.create__date {
  opacity: 0.8;
  font-size: 11px;
  font-weight: 500;
  color: grey;
}
</style>
