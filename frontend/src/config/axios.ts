import axios, { AxiosInstance } from 'axios';

const base = "https://tatvamai-webtech.onrender.com";
const instance: AxiosInstance = axios.create({
baseURL: base ? `${base}/api/v1` : 'http://localhost:3000/api/v1',
  withCredentials: true,
  timeout: 120000
});


instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            if (config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        // Debug cookies
        console.log('Request Cookies:', document.cookie);
        console.log('Request:', {
            url: config.url,
            method: config.method,
            data: config.data,
            headers: config.headers,
            withCredentials: config.withCredentials
        });
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        // Debug response cookies
        console.log('Response Cookies:', response.headers['set-cookie']);
        console.log('Response:', {
            status: response.status,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('Response Error:', {
                status: error.response.status,
                data: error.response.data,
                message: error.message,
                headers: error.response.headers
            });
        } else {
            console.error('Network/Error:', {
                message: error.message,
                stack: error.stack
            });
        }
        return Promise.reject(error);
    }
);

export default instance;
