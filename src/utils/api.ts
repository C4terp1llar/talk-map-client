import axios, { type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
    // 'https://talkmapserver-production.up.railway.app/api/'
    // 'http://localhost:5000/api/'
    baseURL: 'https://talkmapserver-production.up.railway.app/api/',
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;