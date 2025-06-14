import { ApiResponse, AuthResponse, SignupRequest, SigninRequest, StartRecordingRequest, RecordingResponse, ContributionStatsResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'REQUEST_FAILED',
        message: error instanceof Error ? error.message : 'An error occurred',
      },
    };
  }
}

export const auth = {
  signup: (data: SignupRequest) =>
    fetchApi<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  signin: (data: SigninRequest) =>
    fetchApi<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyOtp: (identifier: string, otp: string) =>
    fetchApi<AuthResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, otp }),
    }),
};

export const recording = {
  start: (data: StartRecordingRequest) =>
    fetchApi<RecordingResponse>('/recording/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  complete: (sessionId: string) =>
    fetchApi<void>(`/recording/${sessionId}/complete`, {
      method: 'POST',
    }),

  getStats: () =>
    fetchApi<ContributionStatsResponse>('/recording/stats', {
      method: 'GET',
    }),
};

export const profile = {
  update: (data: Partial<SignupRequest>) =>
    fetchApi<void>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: () =>
    fetchApi<void>('/profile', {
      method: 'DELETE',
    }),
}; 
 