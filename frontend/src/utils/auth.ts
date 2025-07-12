import { checkCookies } from '../config/axios';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const setAuthTokens = (tokens: AuthTokens) => {
  // Set in localStorage as fallback
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
  
  console.log('✅ Tokens saved to localStorage');
  console.log('Access token saved:', tokens.accessToken ? 'Yes' : 'No');
  console.log('Refresh token saved:', tokens.refreshToken ? 'Yes' : 'No');
};

export const getAuthTokens = (): AuthTokens | null => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (accessToken && refreshToken) {
    return { accessToken, refreshToken };
  }
  
  return null;
};

export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  console.log('✅ Auth tokens cleared from localStorage');
};

export const checkAuthStatus = () => {
  console.log('🔍 Checking authentication status...');
  
  // Check localStorage
  const localTokens = getAuthTokens();
  console.log('LocalStorage tokens:', localTokens ? 'Found' : 'Not found');
  
  // Check cookies
  const cookieStatus = checkCookies();
  
  return {
    hasLocalTokens: !!localTokens,
    hasCookies: cookieStatus.hasAccessToken && cookieStatus.hasRefreshToken,
    cookieStatus,
    localTokens
  };
};

export const handleLoginResponse = (response: any) => {
  console.log('🔄 Handling login response...');
  
  if (response?.data?.data?.accessToken && response?.data?.data?.refreshToken) {
    const tokens = {
      accessToken: response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken
    };
    
    setAuthTokens(tokens);
    
    // Check if cookies were set
    setTimeout(() => {
      const authStatus = checkAuthStatus();
      console.log('Final auth status:', authStatus);
    }, 500);
    
    return tokens;
  }
  
  console.error('❌ No tokens found in response');
  return null;
}; 