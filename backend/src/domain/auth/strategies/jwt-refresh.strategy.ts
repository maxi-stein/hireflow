import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/base-user/user.service';
import { getAuthConfig } from '../helper';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      // Extract from the 'Refresh' cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.Refresh,
      ]),
      secretOrKey: getAuthConfig(configService).refreshSecret,
      passReqToCallback: true,
    });
  }

  // Validates the refresh token extracted from the cookie.
  async validate(req: Request, payload: any) {
    const refresh_token = req.cookies?.Refresh;
    if (!refresh_token) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const user = await this.usersService.getUserIfRefreshTokenMatches(
      refresh_token,
      payload.user_id,
    );
    if (!user) {
      throw new UnauthorizedException('Refresh token invalid or revoked');
    }

    return user;
  }
}
