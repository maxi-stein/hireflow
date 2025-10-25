import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  secret: string;
  expiresIn: number;
}

export default registerAs(
  'auth',
  (): AuthConfig => ({
    secret: process.env.JWT_SECRET,
    expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME, 10),
  }),
);
