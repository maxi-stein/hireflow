import { ConfigService } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  logging: boolean;
}

export const getDatabaseConfig = (
  configService: ConfigService,
): DatabaseConfig => {
  const config = configService.get<DatabaseConfig>('database');
  if (!config) throw new Error('Database config missing!');
  return config;
};
