import axios from 'axios';

// Create axios instance with base configuration
// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000,
  withCredentials: true
});

// Add auth token to requests if available
// Add auth token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Handle auth errors and network issues
// Handle auth errors and network issues
api.interceptors.response.use(
  response => response,
  async error => {
    // Network error handling with retries
    if (!error.response) {
      const config = error.config;
      
      // Add retry count if not present
      if (!config.retryCount) {
        config.retryCount = 0;
      }

      // Only retry up to 3 times
      if (config.retryCount < 3) {
        config.retryCount++;
        
        // Exponential backoff
        const backoff = Math.min(1000 * (2 ** config.retryCount), 10000);
        
        await new Promise(resolve => setTimeout(resolve, backoff));
        console.log(`Retrying request to ${config.url} (attempt ${config.retryCount})`);
        return api(config);
      }
    }

    // Handle auth errors
    // Network error handling with retries
    if (!error.response) {
      const config = error.config;
      
      // Add retry count if not present
      if (!config.retryCount) {
        config.retryCount = 0;
      }

      // Only retry up to 3 times
      if (config.retryCount < 3) {
        config.retryCount++;
        
        // Exponential backoff
        const backoff = Math.min(1000 * (2 ** config.retryCount), 10000);
        
        await new Promise(resolve => setTimeout(resolve, backoff));
        console.log(`Retrying request to ${config.url} (attempt ${config.retryCount})`);
        return api(config);
      }
    }

    // Handle auth errors
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export { api };