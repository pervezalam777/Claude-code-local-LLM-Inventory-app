import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create a singleton axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token or other headers to outgoing requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Optional: Add authentication token here if needed
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    // Handle request error before it's sent
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Helper function to convert snake_case keys to camelCase
const convertToCamelCase = <T extends object>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(item => convertToCamelCase(item)) as unknown as T;
  }
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    result[camelKey] = typeof value === 'object' ? convertToCamelCase(value) : value;
  }
  return result as T;
};

// Response interceptor - handle global 4xx/5xx errors and convert snake_case to camelCase
apiClient.interceptors.response.use(
  (response) => {
    // Convert response data from snake_case to camelCase
    if (response.data) {
      response.data = convertToCamelCase(response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle HTTP errors globally
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 400:
          console.error('Bad Request:', error.response.data);
          break;
        case 401:
          console.error('Unauthorized - Please log in');
          // Optional: Redirect to login page
          break;
        case 403:
          console.error('Forbidden', error.response.data);
          break;
        case 404:
          console.error('Not Found:', error.response.data);
          break;
        case 500:
          console.error('Server Error:', error.response.data);
          break;
        default:
          console.error(`Error ${status}:`, error.response.data);
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Is the server running?');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
