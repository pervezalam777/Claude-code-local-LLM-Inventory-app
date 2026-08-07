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

// Response interceptor - handle global 4xx/5xx errors
apiClient.interceptors.response.use(
  (response) => response,
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
