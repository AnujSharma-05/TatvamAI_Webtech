export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  demographics?: {
    age: number;
    gender: string;
    language: string[];
    education: string;
  };
}

export interface RecordingSession {
  id: string;
  userId: string;
  domain: string;
  language: string;
  duration: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface QRToken {
  id: string;
  purpose: string;
  expiresAt: Date;
  metadata?: Record<string, unknown>;
}

export interface Contribution {
  sessionId: string;
  userId: string;
  incentiveAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: Date;
}

// API Request Types
export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  demographics?: User['demographics'];
}

export interface SigninRequest {
  identifier: string; // email or phone
  otp: string;
}

export interface StartRecordingRequest {
  language: string;
  domain: string;
  duration: number;
}

export interface UploadChunkRequest {
  sessionId: string;
  chunkNumber: number;
  audioBlob: Blob;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RecordingResponse {
  session: RecordingSession;
  uploadUrls: string[];
}

export interface ContributionStatsResponse {
  totalSessions: number;
  totalDuration: number;
  totalIncentives: number;
  languageBreakdown: Record<string, number>;
} 