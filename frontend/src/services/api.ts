import axios from 'axios';
import { authEvents } from './auth-events';
import { useAppStore } from '../store/useAppStore';

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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh' &&
      originalRequest.url !== '/auth/login'
    ) {
      originalRequest._retry = true;

      try {
        const response = await apiClient.post(`/auth/refresh`, {}, { withCredentials: true });

        const { access_token } = response.data;

        const currentUser = useAppStore.getState().user;
        if (currentUser) {
          useAppStore.getState().setAuth(currentUser, access_token);
        }

        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        useAppStore.getState().logout();
        authEvents.onUnauthorized();
        return Promise.reject(refreshError);
      }
    }

    if (status === 401) {
      useAppStore.getState().logout();
      authEvents.onUnauthorized();
    }

    return Promise.reject(error);
  },
);
