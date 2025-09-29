import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  cors: {
    enabled: boolean;
    origins: string[];
  };
  rateLimit: {
    ttl: number;
    limit: number;
  };
}

export default registerAs('appConfig', () => {
  const origins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  return {
    port: parseInt(process.env.PORT, 10) || 3000,

    cors: {
      enabled: process.env.CORS_ENABLED !== 'false',
      origins,
    },
  };
});
