import { ConfigService } from '@nestjs/config';
import { AuthConfig } from 'src/config/auth.config';

export const getAuthConfig = (configService: ConfigService): AuthConfig => {
  const config = configService.get<AuthConfig>('auth');
  if (!config) throw new Error('Authentication config missing!');
  return config;
};
