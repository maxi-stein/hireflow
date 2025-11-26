import axios from "axios";
import { authEvents } from "./auth-events";
import { useAppStore } from "../store/useAppStore";

const BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
  (error) => Promise.reject(error)
);

//Intercepting unauthorized error
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      useAppStore.getState().logout();
      authEvents.onUnauthorized(); // this global callback will dispatch a navigate(/login) from react-router
    }

    return Promise.reject(error);
  }
);
