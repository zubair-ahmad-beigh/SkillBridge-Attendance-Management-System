// lib/apiClient.ts — centralized axios instance with env-var base URL
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const DEV_ROLE = process.env.NEXT_PUBLIC_DEV_ROLE; // optional override

const apiClient = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// In dev mode: inject X-Dev-Role from env (never hardcoded)
apiClient.interceptors.request.use((config) => {
  if (DEV_ROLE) {
    config.headers['X-Dev-Role'] = DEV_ROLE;
  }
  return config;
});

export default apiClient;
export { API_BASE };
