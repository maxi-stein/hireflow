import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
}));
