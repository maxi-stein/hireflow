import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/base-user/user.service';
import { UserType } from '../../users/interfaces/user.enum';
import { JwtUser } from '../../users/interfaces/jwt.user';

@Injectable()
export class CanAccessUser implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: JwtUser = request.user;
    const userId = request.params.userId;

    const userFound = await this.userService.findOne(userId);

    if (!userFound) return false;

    // EMPLOYEES can always access
    if (user.user_type === UserType.EMPLOYEE) return true;

    // CANDIDATES can only access their own user
    if (
      user.user_type === UserType.CANDIDATE &&
      user.user_id === userFound.id
    ) {
      return true;
    }

    return false;
  }
}
