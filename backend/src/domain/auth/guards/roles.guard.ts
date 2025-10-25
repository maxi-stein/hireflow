import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_TYPES_KEY } from '../decorators/roles.decorator';
import { UserType } from 'src/domain/users/interfaces/user.enum';
import { JwtUser } from '../../users/interfaces/jwt.user';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredTypes = this.reflector.getAllAndOverride<UserType[]>(
      USER_TYPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredTypes) return true;

    const request = context.switchToHttp().getRequest();
    const user: JwtUser = request.user;
    return requiredTypes.some((t) => user.user_type === t);
  }
}
