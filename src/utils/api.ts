import axios, { type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
    // 'https://talkmapserver-production.up.railway.app/api/'
    // 'http://localhost:5000/api/'
    baseURL: 'http://localhost:5000/api/'
});

export default api;