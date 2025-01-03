export interface Notification {
    id: number;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    timeout: number;
}

export interface FrNotification {
    id: number;
    type: 'receive' | 'abort' | 'decline' | 'submit' | 'delete' | 'react_Photo' | 'react_Post' | 'publish_Photo' | 'publish_many_Photo' | 'publish_Post';
    message: string;
    timeout: number;
    detail: ShortMutualUserFriend;
    actionType: 'friends' | 'media' | 'communications';
    phId?: string
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

export interface ShortMutualUserFriend{
    _id: string,
    nickname: string,
    nickname_color: string | null,
    avatar: {
        asset_url: string;
    },
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
    liked: boolean,
    mode: 'internal' | 'external',
    media: {id: string, url: string, type: string}[] | []
}

export interface PostOwner {
    _id: string,
    nickname: string,
    nickname_color: string | null,
    avatar: string,
    match: boolean
}

export interface UserComment{
    _id: string,
    entityId: string,
    entityType: 'Publication' | 'Post' | 'Comment',
    parentCommentId: string | null,
    text: string,
    isEdited: boolean,
    createdAt: Date,
    repliesCount: number,
    mode: 'internal' | 'external',
    user: {
        _id: string,
        nickname: string,
        nickname_color: string | null,
        avatar: string,
    }
}