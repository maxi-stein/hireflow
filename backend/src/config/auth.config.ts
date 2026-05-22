import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  secret: string;
  expiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: string;
  refreshCookieMaxAge: number;
}

export default registerAs(
  'auth',
  (): AuthConfig => ({
    secret: process.env.JWT_SECRET,
    expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME, 10),
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
    refreshCookieMaxAge: parseInt(process.env.JWT_REFRESH_COOKIE_MAX_AGE, 10),
  }),
);
