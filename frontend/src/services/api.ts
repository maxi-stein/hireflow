import axios from 'axios';
import { authEvents } from './auth-events';
import { useAppStore } from '../store/useAppStore';
import { queryClient } from './queryClient';

const BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

//Adding the access token auth to every request, if exists in localStorage.
apiClient.interceptors.request.use(
  (config) => {
    const token = useAppStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

//Intercepting unauthorized error
apiClient.interceptors.response.use(
  (response) => response, // If 2xx code, return response
  async (error) => {
    // if 4xx or 5xx code
    const originalRequest = error.config;
    const status = error.response?.status;

    // If unauthorized (401), no retries and not a refresh or login request
    if (
      status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh' &&
      originalRequest.url !== '/auth/login'
    ) {
      originalRequest._retry = true;

      try {
        // Try to get refresh token (credentials true -> httpOnly cookie in browser)
        const response = await apiClient.post(`/auth/refresh`, {}, { withCredentials: true });

        // Get new access token
        const { access_token } = response.data;

        // If user exists, update access token in store
        const currentUser = useAppStore.getState().user;
        if (currentUser) {
          useAppStore.getState().setAuth(currentUser, access_token);
        }

        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // Retry request, now with updated access token
        return apiClient(originalRequest);
      } catch (refreshError) {
        queryClient.clear();
        useAppStore.getState().logout(); // Clear store
        authEvents.onUnauthorized(); // redirect to login
        return Promise.reject(refreshError);
      }
    }

    // If unauthorized but already retried or request is refresh or login, just logout
    if (status === 401) {
      queryClient.clear();
      useAppStore.getState().logout();
      authEvents.onUnauthorized();
    }

    return Promise.reject(error);
  },
);
