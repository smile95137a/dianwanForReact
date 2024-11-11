import axios, { AxiosError, AxiosInstance } from 'axios';
import { removeAllState } from '@/utils/Localstorage';
import { getAuthToken } from './AuthService';

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      removeAllState();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
