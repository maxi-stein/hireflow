import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from 'src/config/database.config';

export const getDatabaseConfig = (
  configService: ConfigService,
): DatabaseConfig => {
  const config = configService.get<DatabaseConfig>('database');
  if (!config) throw new Error('Database config missing!');
  return config;
};
