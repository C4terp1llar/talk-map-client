export interface Notification {
    id: number;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    timeout: number;
}

export interface FrNotification {
    id: number;
    type: 'receive' | 'abort' | 'decline' | 'submit' | 'delete' | 'react_Photo' | 'react_Post' | 'react_Comment' | 'publish_Photo' | 'publish_many_Photo' | 'publish_Post'
        | 'comment_Photo' | 'comment_Post' | 'comment_Comment' | 'receive_Msg';
    message: string;
    timeout: number;
    detail: ShortMutualUserFriend;
    actionType: 'friends' | 'media' | 'communications';
    additional_text?: string,
    entity_id?: string,
}


export interface Address {
    display_name: string;
    lat: number;
    lon: number;

    type: string;
    address_type: string;
    name: string | null;

    city: string | null;

    house_number: number | null;
    road: string | null;

    city_district: string | null;
    state: string | null;
    country: string;
    country_code: string;

    boundingbox: string[];
}

export interface ShortAddress {
    display_name: string;
    city: string | null;
    state: string | null;
    country: string;
}

export interface SearchFriendFilter {
    globalSearch: boolean,
    sortStr: string,
    cityFilter: string | null,
    minAgeFilter: number,
    maxAgeFilter: number,
    genderFilter: 'male' | 'female' | 'any',
    nicknameFilter: string | null
}

export interface SearchFoundFriend {
    _id: string,
    nickname: string,
    nickname_color: string | null,
    b_date: Date,
    gender: 'male' | 'female',
    isIncoming: boolean | null,
    isOutgoing: boolean | null,
    mutual: {
        mFriends: ShortMutualUserFriend[],
        amount: number,
        hasMore: boolean | null;
    },
    avatar: {
        asset_url: string;
    },
    address: ExternalUserInfoAddress
}

export interface ShortMutualUserFriend {
    _id: string,
    nickname: string,
    nickname_color: string | null,
    avatar: {
        asset_url: string;
    },
}

export interface ShortFriend {
    user_id: string,
    nickname: string,
    nickname_color: string | null,
    avatar: string;
}

export interface MainUserInfo {
    _id: string;
    email: string;
    nickname: string;
    b_date: string;
    gender: 'male' | 'female';
    avatar: string;
    wallpaper: string | null;
    nickname_color?: string | null;
    tags?: { emoji: string, text: string }[] | null;
}

export interface ExternalUserInfoMain {
    _id: string,
    email: string;
    nickname: string;
    b_date: string;
    gender: 'male' | 'female';
    avatar: string;
    wallpaper: string | null;
    nickname_color?: string | null;
    tags?: { emoji: string, text: string }[] | null;
}

export interface ExternalUserInfoAddress {
    city: string;
    country: string;
    country_code: string;
}

export interface FriendRequest {
    _id: string,
    initiator_id: string,
    sender_id: string,
    recipient_id: string,
    send_time: Date,
    userInfo: {
        nickname: string,
        nickname_color: string | null,
        b_date: Date,
        gender: 'male' | 'female',
    }
    mutual: {
        mFriends: ShortMutualUserFriend[],
        amount: number,
        hasMore: boolean | null;
    },
    address: ExternalUserInfoAddress,
    avatar: {
        asset_url: string;
    }
}

export interface Photo {
    _id: string,
    user_id: string,
    media_id: string,
    url: string,
    createdAt: Date
}

export interface PhotoG {
    _id: string,
    user_id: string,
    media_id: string,
    url: string,
    mode: 'internal' | 'external',
    createdAt: Date,
    nickname: string,
    nickname_color: string | null,
    likesCount: number,
    liked: boolean,
}

export interface Post {
    _id: string,
    user_id: string,
    text: string,
    createdAt: Date,
    likes_count: number,
    comments_count: number,
    liked: boolean,
    mode: 'internal' | 'external',
    media: { id: string, url: string, type: string }[] | []
}

export interface PostOwner {
    _id: string,
    nickname: string,
    nickname_color: string | null,
    avatar: string,
    match: boolean
}

export interface UserComment {
    _id: string,
    entityId: string,
    entityType: 'Publication' | 'Post' | 'Comment',
    parentCommentId: string | null,
    text: string,
    isEdited: boolean,
    isDeleted: boolean,
    createdAt: Date,
    updatedAt: Date,
    repliesCount: number,
    mode: 'internal' | 'external',
    user: ShortUserInfo
}

export interface ShortUserInfo {
    _id: string,
    nickname: string,
    nickname_color: string | null,
    avatar: string,
}

export interface UserSession {
    _id: string,
    user_id: string,
    device: string,
    created: Date
}

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

export interface PersonalConv {
    _id: string,
    messageCount: number,
    unreadMessagesCount: number,
    updatedAt: Date,
    lastMessage: LastDialogMessage,
    opponent: ShortUserInfo,
}

export interface GroupConv {
    _id: string,
    owner_id: string,
    title: string,
    cover_url: string,
    messageCount: number,
    unreadMessagesCount: number,
    updatedAt: Date,
    lastMessage: LastDialogMessage,
}

export interface FullMessage {
    _id: string,
    conversation_id: string,
    conversationType: "PersonalConversation" | "GroupConversation",
    messageType: "default" | "system",
    content: string | null,
    replyTo: string | null,
    isEdited: boolean,
    isDeleted: boolean,
    isForwarded: boolean,
    createdAt: Date,
    updatedAt: Date,
    isRead: boolean,
    sender: ShortUserInfo,
    mode: 'internal' | 'external',
    additionalInfo: string | null,
    mediaInfo: ShortMediaDialogMessage[],
    replyMessage: MessageReply | null
}

export interface MessageReply {
    _id: string,
    user_id: string,
    content: string | null,
    mediaCount: number,
    isEdited: boolean,
    createdAt: Date,
    updatedAt: Date,
    sender: {
        _id: string,
        nickname: string,
        nickname_color: string | null,
    }
}

export interface ReadersFullInfo{
    user_id: string,
    read: boolean,
    userInfo: Omit<ShortUserInfo, '_id'>
}

export interface ConvMemberInfo {
    _id: string,
    nickname: string,
    nickname_color: string | null,
    avatar: string,
    role: 'owner' | 'admin' | 'member'
}

export interface MediaConvInfo {
    _id: string,
    user_id: string,
    conversation_id: string,
    client_filename: string,
    client_file_size: number,
    store_url: string,
    createdAt: Date
    sender: ShortUserInfo
}

export interface UploadMediaFile {
    id: string,
    file: File,
    previewUrl?: string,
    type: string
}

