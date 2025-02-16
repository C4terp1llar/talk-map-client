import type { FullMessage, LastDialogMessage } from "@/helpers/interfaces";

type SystemMessageHandler = (msg: LastDialogMessage | FullMessage) => string;

const roleMap = {
    admin: 'админа',
    member: 'участника',
    owner: 'владельца',
}

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

    change_role: (msg) => {
        const senderName = "sender_nickname" in msg
            ? msg.sender_nickname
            : msg.sender.nickname;

        if (msg.additionalInfo) {
            const addData = msg.additionalInfo.split(';');

            if (addData.length >= 3) {
                const targetUser = addData[1]?.split(':')[1] || "неизвестного пользователя";
                const newRoleKey = addData[2]?.split(':')[1];

                const newRole = roleMap[newRoleKey as keyof typeof roleMap] || "неизвестную роль";

                return `${senderName} изменил(а) роль ${targetUser} на ${newRole}`;
            }
        }
        return `${senderName} изменил(а) роль участника`;
    },

    kick_member: (msg) => {
        const senderName = "sender_nickname" in msg
            ? msg.sender_nickname
            : msg.sender.nickname;

        if (msg.additionalInfo) {
            const addData = msg.additionalInfo.split(';');

            if (addData.length >= 2) {
                const targetUser = addData[1]?.split(':')[1] || "неизвестного пользователя";
                return `${senderName} исключил(а) ${targetUser} из группы`;
            }
        }
        return `${senderName} исключил(а) участника из группы`;
    },

};

export function adaptSystemMessages(msg: LastDialogMessage | FullMessage): string {
    if (msg.messageType === "system") {
        const handler = systemMessageHandlers[msg.content || "default"];
        return handler ? handler(msg) : "Неизвестное системное сообщение";
    }
    return msg.content || "Сообщение отсутствует";
}
