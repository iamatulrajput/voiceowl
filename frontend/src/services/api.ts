// API service for VoiceOwl backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Transcription {
  _id: string;
  audioUrl: string;
  transcription: string;
  source: 'mock' | 'azure';
  language?: string;
  duration?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface TranscriptionsListResponse {
  transcriptions: Transcription[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

class ApiService {
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 30000
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  async createTranscription(audioUrl: string): Promise<Transcription> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/transcription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audioUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create transcription');
    }

    const result: ApiResponse<Transcription> = await response.json();
    return result.data;
  }

  async createAzureTranscription(
    audioUrl: string,
    language?: string
  ): Promise<Transcription> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/azure-transcription`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioUrl, language }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create Azure transcription');
    }

    const result: ApiResponse<Transcription> = await response.json();
    return result.data;
  }

  async getTranscriptions(
    page = 1,
    limit = 10
  ): Promise<TranscriptionsListResponse> {
    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/transcriptions?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch transcriptions');
    }

    const result = await response.json();
    
    // Backend returns: { success, data: [...], pagination: {...} }
    // Transform to expected format
    return {
      transcriptions: result.data || [],
      total: result.pagination?.total || 0,
      page: result.pagination?.page || page,
      limit: result.pagination?.limit || limit,
      hasMore: result.pagination?.hasMore || false,
    };
  }

  async getTranscriptionById(id: string): Promise<Transcription> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/transcription/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch transcription');
    }

    const result: ApiResponse<Transcription> = await response.json();
    return result.data;
  }

  async getAzureLanguages(): Promise<string[]> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/azure-languages`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch languages');
    }

    const result: ApiResponse<{ languages: string[] }> = await response.json();
    return result.data.languages;
  }

  async healthCheck(): Promise<{ status: string }> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return await response.json();
  }
}

export const apiService = new ApiService();
