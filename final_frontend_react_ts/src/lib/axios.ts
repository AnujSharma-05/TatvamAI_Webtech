import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  withCredentials: true, // for cookies
  timeout: 12000, // 12 seconds timeout
});

// Add a request interceptor to log requests
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request:', {
            url: config.url,
            method: config.method,
            data: config.data,
            headers: config.headers
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
        console.log('Response:', {
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('Response Error:', {
                status: error.response.status,
                data: error.response.data,
                message: error.message
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