// Global API Configuration
// In production (Render), the React app is served by the same Node.js server.
// Therefore, the API base URL should be empty string ('') so it makes relative requests (e.g. /api/status).
// During local development, Vite proxy handles /api, or we can use localhost:5000.

const isProd = import.meta.env.PROD || import.meta.env.MODE === 'production';

export const API_BASE = import.meta.env.VITE_API_URL || '';

export const fetchWithHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    
    // Log the API response for debugging
    console.log(`[API ${options.method || 'GET'}] ${url} - Status: ${response.status}`);
    
    if (!response.ok) {
      let errorMessage = 'API Error';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`[API ERROR] ${url}:`, error.message);
    throw error;
  }
};
