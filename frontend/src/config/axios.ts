import axios, { AxiosInstance } from 'axios';

const base = "https://tatvamai-webtech.onrender.com";
const instance: AxiosInstance = axios.create({
baseURL: base ? `${base}/api/v1` : 'http://localhost:3000/api/v1',
  withCredentials: true,
  timeout: 120000
});

// Utility function to check cookies
export const checkCookies = () => {
  console.log('🔍 Checking cookies...');
  console.log('Document cookies:', document.cookie);
  console.log('Cookie length:', document.cookie.length);
  
  const cookies = document.cookie.split(';').map(c => c.trim());
  console.log('Parsed cookies:', cookies);
  
  const accessTokenCookie = cookies.find(c => c.startsWith('accessToken='));
  const refreshTokenCookie = cookies.find(c => c.startsWith('refreshToken='));
  
  console.log('Access token cookie:', accessTokenCookie ? '✅ Found' : '❌ Not found');
  console.log('Refresh token cookie:', refreshTokenCookie ? '✅ Found' : '❌ Not found');
  
  return {
    hasAccessToken: !!accessTokenCookie,
    hasRefreshToken: !!refreshTokenCookie,
    allCookies: cookies
  };
};

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
        console.log('All Cookies:', document.cookie.split(';').map(c => c.trim()));
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
        console.log('All Response Headers:', response.headers);
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
        
        // Check if tokens are in response body
        if (response.data?.data?.accessToken) {
            console.log('✅ Access token found in response body');
        }
        if (response.data?.data?.refreshToken) {
            console.log('✅ Refresh token found in response body');
        }
        
        // Check cookies after response
        setTimeout(() => {
            checkCookies();
        }, 100);
        
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
