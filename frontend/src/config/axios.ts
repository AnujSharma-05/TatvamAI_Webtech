import axios, { AxiosInstance } from 'axios';

const base = "http://localhost:3000";
const instance: AxiosInstance = axios.create({
  baseURL: base ? `${base}/api/v1` : 'http://localhost:3000/api/v1',
  timeout: 120000,
  withCredentials: false // Explicitly set to false for localStorage auth
});

instance.interceptors.request.use(
    (config) => {
        // console.log('Making request to:', config.url);
        // console.log('Request method:', config.method);
        // console.log('Request headers:', config.headers);
        
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
        // console.log('Response received:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.status, error.response?.data);
        console.error('Error details:', error.message);
        
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
