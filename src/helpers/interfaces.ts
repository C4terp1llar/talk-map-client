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