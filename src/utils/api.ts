import axios, { type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: 'https://talkmapserver-production.up.railway.app/api/',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default api;