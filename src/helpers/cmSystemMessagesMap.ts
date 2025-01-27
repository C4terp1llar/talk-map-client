/*

export interface LastDialogMessage {
    _id: string,
    sender: string,
    sender_nickname: string,
    content?: string,
    sendTime: Date,
    messageType: "default" | 'system',
    mode: 'internal' | 'external',
    additionalInfo: string | null,
    isRead: boolean,
    media: ShortMediaDialogMessage[],
}

export interface ShortMediaDialogMessage {
    _id: string,
    name: string,
    type: string,
    size: number,
    url: string
}

*/

import type { LastDialogMessage } from "@/helpers/interfaces";

type SystemMessageHandler = (msg: LastDialogMessage) => string;

const systemMessageHandlers: Record<string, SystemMessageHandler> = {
    default: () => "Системное сообщение",

    create_group: (msg) => {
        if (msg.additionalInfo) return `${msg.sender_nickname} создал(а) группу ${msg.additionalInfo.split(":")[1] || ''}`;
        return `${msg.sender_nickname} создал(а) группу`;
    },


};

export function adaptSystemMessages(msg: LastDialogMessage): string {
    if (msg.messageType === "system") {
        const handler = systemMessageHandlers[msg.content || "default"];
        return handler ? handler(msg) : "Неизвестное системное сообщение";
    }
    return msg.content || "Сообщение отсутствует";
}