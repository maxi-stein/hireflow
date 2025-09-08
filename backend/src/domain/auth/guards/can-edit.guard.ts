import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/base-user/user.service';
import { UserType } from '../../users/interfaces/user.enum';

@Injectable()
export class CanEditUser implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userId = request.params.id;

    const userFound = await this.userService.findOne(userId);

    if (!userFound) return false;

    // EMPLOYEES can always edit
    if (user.role === UserType.EMPLOYEE) return true;

    // CANDIDATES can only edit their own user
    if (user.role === UserType.CANDIDATE && user.id === userFound.id) {
      return true;
    }

    return false;
  }
}
