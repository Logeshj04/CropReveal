import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface DiagnosisResponse {
  predicted_label: string;
  confidence: number;
  llm_response: string;
}

export interface ChatResponse {
  response: string;
}

export interface DiagnosisRequest {
  image: File;
  language?: string;
  followup_question?: string;
}

export interface ChatRequest {
  query: string;
  language?: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json();  // Backend response
    } catch (error) {
      console.error('API request failed:', error);
      if (error instanceof TypeError && (error as Error).message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check if the backend is running.');
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout: The server took too long to respond.');
      }
      throw error;
    }
  }

  async diagnoseImage(data: DiagnosisRequest): Promise<DiagnosisResponse> {
    const formData = new FormData();
    formData.append('image', data.image); // Add image to request

    if (data.language) {
      formData.append('language', data.language);
    }

    if (data.followup_question) {
      formData.append('followup_question', data.followup_question);
    }

    return this.makeRequest<DiagnosisResponse>('/predict', {
      method: 'POST',
      body: formData,
    });
  }

  async chatWithAI(data: ChatRequest): Promise<ChatResponse> {
    const formData = new FormData();
    formData.append('query', data.query);

    if (data.language) {
      formData.append('language', data.language);
    }

    return this.makeRequest<ChatResponse>('/chat', {
      method: 'POST',
      body: formData,
    });
  }
}

export const apiService = new ApiService(); 