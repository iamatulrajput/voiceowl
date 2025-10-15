export interface TranscriptionRequest {
  audioUrl: string;
}

export interface TranscriptionResponse {
  _id: string;
  audioUrl: string;
  transcription: string;
  source?: 'mock' | 'azure';
  createdAt: Date;
}

export interface AzureTranscriptionRequest {
  audioUrl: string;
  language?: string;
}

export interface TranscriptionDocument {
  audioUrl: string;
  transcription: string;
  source: 'mock' | 'azure';
  language?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
  timeout: number;
}

export interface AzureSpeechConfig {
  subscriptionKey: string;
  region: string;
  endpoint?: string;
}

