import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const jwtUser: any = {
      user_id: payload.user_id, // The actual user_id from users table
      email: payload.email,
      user_type: payload.type,
      entity_id: payload.sub, // The entity_id (candidate_id or employee_id)
    };

    // Add employee_roles if present in payload
    if (payload.employee_roles) {
      jwtUser.employee_roles = payload.employee_roles;
    }

    return jwtUser;
  }
}
