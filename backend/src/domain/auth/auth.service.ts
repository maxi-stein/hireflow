import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/base-user/user.service';
import { JwtUser } from '../users/interfaces/jwt.user';
import { UserType } from '../users/interfaces/user.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Used in local strategy. Checks if password is correct and returns the entire user
  async validateUser(email: string, password: string): Promise<JwtUser> {
    const user = await this.usersService.findByEmailForAuthentication(email);

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      // Remove password from the returned object
      const { password: _, ...jwtUser } = user;
      return jwtUser as JwtUser;
    }
    return null;
  }

  /**  After the @UseGuards(LocalAuthGuard) sets the user in the request, this method is called with said user.
   * Returns the user info + access_token
   * */
  async login(user: JwtUser) {
    const payload = {
      email: user.email,
      sub: user.entity_id,
      type: user.user_type,
      user_id: user.user_id,
      employee_roles:
        user.user_type === UserType.EMPLOYEE ? user.employee_roles : undefined,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.entity_id,
        email: user.email,
        type: user.user_type,
        employee_roles: payload.employee_roles,
      },
    };
  }

  async getProfileByEntity(entityId: string, userType: JwtUser['user_type']) {
    const user = await this.usersService.findUserByEntityId(entityId, userType);
    return user;
  }
}
