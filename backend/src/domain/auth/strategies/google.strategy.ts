import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { getAuthConfig } from '../helper';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: getAuthConfig(configService).googleClientId,
      clientSecret: getAuthConfig(configService).googleClientSecret,
      callbackURL: getAuthConfig(configService).googleCallbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, id } = profile;
    const email = emails[0].value;

    const userProfile = {
      email,
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      googleId: id,
    };

    const user = await this.authService.validateGoogleUser(userProfile);

    if (!user) {
      throw new UnauthorizedException();
    }

    done(null, user);
  }
}
