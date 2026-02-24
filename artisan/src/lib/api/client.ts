type RequestConfig = RequestInit & {
  params?: Record<string, string | number | boolean>;
};

interface PaginatedApiResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { params, ...fetchConfig } = config;

    let url = `${this.baseURL}${endpoint}`;

    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params)
          .filter(([, value]) => value !== undefined && value !== '')
          .map(([key, value]) => [key, String(value)])
      ).toString();
      if (queryString) url += `?${queryString}`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge any additional headers from config  
    if (fetchConfig.headers) {
      const configHeaders = fetchConfig.headers as Record<string, string>;
      Object.assign(headers, configHeaders);
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...fetchConfig,
      headers,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'API request failed');
    }

    // For paginated responses, return { data, pagination }
    if (responseData.pagination) {
      return {
        data: responseData.data,
        pagination: responseData.pagination,
      } as T;
    }

    // For success responses, unwrap data
    return responseData.data || responseData;
  }

  get<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, config?: RequestConfig) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body?: unknown, config?: RequestConfig) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body?: unknown, config?: RequestConfig) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1'
);

export type { PaginatedApiResponse };