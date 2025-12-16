import { apiClient } from './api';
import type { LoginDto, RegisterDto, AuthResponse } from '../types/api/auth.types';
import type { User } from '../types/models/user.types';

export const authService = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterDto): Promise<User> => {
    const { data } = await apiClient.post<User>('/auth/register', userData);
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/profile');
    return data;
  },
};
