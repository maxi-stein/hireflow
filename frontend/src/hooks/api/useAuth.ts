import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../../services/auth.service';
import { useAppStore } from '../../store/useAppStore';
import type { LoginDto, RegisterDto, JwtUser } from '../../types/api/auth.types';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: LoginDto) => authService.login(credentials),
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
  });
};

export const useProfileQuery = () => {
  const { setAuth, token } = useAppStore();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const user = await authService.getProfile();
      if (token) {
          // Map User to JwtUser
          const jwtUser: JwtUser = {
            id: user.id,
            email: user.email,
            type: user.user_type,
            employee_roles: user.employee?.roles
          };
          setAuth(jwtUser, token); 
      }
      return user;
    },
    enabled: !!token,
    retry: false,
  });
};
