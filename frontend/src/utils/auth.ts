export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const setAuthTokens = (tokens: AuthTokens) => {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
  
  // Dispatch custom event to notify components of auth state change
  window.dispatchEvent(new CustomEvent('authStateChanged'));
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
  
  // Dispatch custom event to notify components of auth state change
  window.dispatchEvent(new CustomEvent('authStateChanged'));
};

export const isAuthenticated = (): boolean => {
  const tokens = getAuthTokens();
  return !!tokens?.accessToken;
};

export const handleLoginResponse = (response: any): AuthTokens | null => {
  if (response?.data?.data?.accessToken && response?.data?.data?.refreshToken) {
    const tokens = {
      accessToken: response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken
    };
    
    setAuthTokens(tokens);
    return tokens;
  }
  
  return null;
};

export const logout = () => {
  clearAuthTokens();
  window.location.href = '/auth/signin';
}; 