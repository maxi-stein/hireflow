import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/base-user/user.service';
import { JwtUser } from '../users/interfaces/jwt.user';
import { UserType } from '../users/interfaces/user.enum';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/ChangePasswordDto';
import { MailerService } from '../mailer/mailer.service';
import { generateRandomPassword } from 'src/domain/auth/utils/password-generator.util';
import { EmailTemplateType } from 'src/domain/mailer/utils/email-template.factory';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
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

  async changePassword(user_id: string, changePasswordDto: ChangePasswordDto) {
    //Get the user with the password
    const user = await this.usersService.findOne(
      { id: user_id },
      undefined,
      undefined,
      true,
    );

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException({
        message: 'Old password is incorrect',
        code: 'WRONG_PASSWORD',
      });
    }

    // The usersService.update method handles password hashing, so we pass the plain password
    return this.usersService.update(user_id, {
      password: changePasswordDto.newPassword,
    });
  }

  async resetPassword(email: string) {
    // Find user by email (without password for security)
    const userForAuth =
      await this.usersService.findByEmailForAuthentication(email);

    if (!userForAuth) {
      throw new NotFoundException({
        message: 'User with this email does not exist',
        code: 'USER_NOT_FOUND',
      });
    }

    // Generate new random password
    const newPassword = generateRandomPassword(10);

    // Update user's password (usersService.update handles hashing)
    await this.usersService.update(userForAuth.user_id, {
      password: newPassword,
    });

    // Get user details for email personalization
    const user = await this.usersService.findOne({ email });

    // Send email with new password
    await this.mailerService.sendMail(
      EmailTemplateType.PASSWORD_RESET,
      {
        email: user.email,
        newPassword: newPassword,
        firstName: user.first_name,
      },
      [{ address: user.email, name: `${user.first_name} ${user.last_name}` }],
      'Password Reset - HireFlow',
    );

    return {
      message:
        'Password reset successful. Check your email for the new password.',
    };
  }
}
