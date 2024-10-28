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
    avatar: {
        asset_url: string;
    },
    address: {
        city: string;
        country: string;
        country_code: string;
    }
}

export interface MainUserInfo {
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

