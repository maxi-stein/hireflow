import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../../services/auth.service';
import { useAppStore } from '../../store/useAppStore';
import type { LoginDto, RegisterDto } from '../../types/api/auth.types';

export const useLoginMutation = () => {
  const { setUser } = useAppStore();

  return useMutation({
    mutationFn: (credentials: LoginDto) => authService.login(credentials),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      setUser(data.user);
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
  });
};

export const useProfileQuery = () => {
  const { setUser } = useAppStore();
  const token = localStorage.getItem('access_token');

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const user = await authService.getProfile();
      setUser(user); // Sync store with fresh data
      return user;
    },
    enabled: !!token, // Only run if token exists
    retry: false,
  });
};
