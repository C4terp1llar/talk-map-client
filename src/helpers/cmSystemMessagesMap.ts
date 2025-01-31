import type { FullMessage, LastDialogMessage } from "@/helpers/interfaces";

type SystemMessageHandler = (msg: LastDialogMessage | FullMessage) => string;

const systemMessageHandlers: Record<string, SystemMessageHandler> = {
    default: () => "Системное сообщение",

    create_group: (msg) => {
        const senderName = "sender_nickname" in msg
            ? msg.sender_nickname
            : msg.sender.nickname;

        if (msg.additionalInfo) {
            return `${senderName} создал(а) группу ${msg.additionalInfo.split(":")[1] || ''}`;
        }
        return `${senderName} создал(а) группу`;
    },
};

export function adaptSystemMessages(msg: LastDialogMessage | FullMessage): string {
    if (msg.messageType === "system") {
        const handler = systemMessageHandlers[msg.content || "default"];
        return handler ? handler(msg) : "Неизвестное системное сообщение";
    }
    return msg.content || "Сообщение отсутствует";
}
