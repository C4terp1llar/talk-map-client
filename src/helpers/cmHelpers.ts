import type {FullMessage, LastDialogMessage, ShortMediaDialogMessage} from "@/helpers/interfaces";
import {adaptSystemMessages} from "@/helpers/cmSystemMessagesMap";

export const getMediaNames = (media: ShortMediaDialogMessage[]) => {
    let str = '';
    for (let i = 0; i < media.length; i++){
        str += media[i].name;
        if (media[i+1]){
            str += ', ';
        }else{
            str += ';';
        }
    }
    return str
}

export const getMsgContent = (msg: LastDialogMessage | FullMessage) => {
    if (msg.messageType === 'system'){
        return adaptSystemMessages(msg)
    }
    return msg.content
}

