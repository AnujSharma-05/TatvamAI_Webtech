import axios, { AxiosInstance } from 'axios';

const base = "https://tatvamai-webtech.onrender.com";
const instance: AxiosInstance = axios.create({
  baseURL: base ? `${base}/api/v1` : 'http://localhost:3000/api/v1',
  timeout: 120000,
  withCredentials: false // Explicitly set to false for localStorage auth
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            if (config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/auth/signin';
        }
        return Promise.reject(error);
    }
);

export default instance;
