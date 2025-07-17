import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  secret: string;
  expiresIn: string;
}

export default registerAs(
  'auth',
  (): AuthConfig => ({
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  }),
);
