import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_TYPES_KEY } from '../decorators/roles.decorator';
import { UserType } from 'src/domain/users/interfaces/user.enum';
import { JwtUser } from '../../users/interfaces/jwt.user';

/**
 * Guard that restricts route access based on user type (employee or candidate).
 * Use the @RequireUserType() decorator on routes to specify which user types are allowed.
 */
@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredTypes = this.reflector.getAllAndOverride<UserType[]>(
      USER_TYPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredTypes) return true; // If no user types required, allow access

    const request = context.switchToHttp().getRequest();
    const user: JwtUser = request.user;
    return requiredTypes.some((t) => user.user_type === t);
  }
}
