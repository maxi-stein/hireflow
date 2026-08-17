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
import { ConfigService } from '@nestjs/config';
import { getAuthConfig } from './helper';
import { CandidateService } from '../users/candidate/candidate.service';
import { AuthProvider } from '../users/interfaces/user.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private configService: ConfigService,
    private candidateService: CandidateService,
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

  async validateGoogleUser(profile: { email: string; firstName: string; lastName: string; googleId: string }): Promise<JwtUser> {
    const { email, firstName, lastName, googleId } = profile;
    
    // Check if user exists
    let userForAuth = await this.usersService.findByEmailForAuthentication(email);
    
    if (userForAuth) {
      // User exists, update auth_provider and google_id if needed
      const fullUser = await this.usersService.findOne({ email: email });
      if (!fullUser.google_id) {
        await this.usersService.update(fullUser.id, { 
          google_id: googleId,
          auth_provider: AuthProvider.GOOGLE
        });
      }
      
      const { password, ...jwtUser } = userForAuth;
      return jwtUser as JwtUser;
    } else {
      // Create new user as CANDIDATE
      const newUser = await this.candidateService.registerGoogleCandidate({
        email,
        firstName,
        lastName,
        googleId
      });
      
      const jwtUser: JwtUser = {
        user_id: newUser.id,
        email: newUser.email,
        user_type: newUser.user_type,
        entity_id: newUser.candidate?.id || '',
      };
      
      return jwtUser;
    }
  }

  // Generates both access and refresh tokens for a given user.
  async getTokens(user: JwtUser) {
    const payload = {
      email: user.email,
      sub: user.entity_id,
      type: user.user_type,
      user_id: user.user_id,
      employee_roles:
        user.user_type === UserType.EMPLOYEE ? user.employee_roles : undefined,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: getAuthConfig(this.configService).refreshSecret,
        expiresIn: getAuthConfig(this.configService).refreshExpiresIn as any,
      }),
    ]);

    return { access_token, refresh_token };
  }

  // Logs in the user, generates tokens, and saves the refresh token hash.
  async login(user: JwtUser) {
    const tokens = await this.getTokens(user);
    await this.usersService.updateRefreshTokenHash(
      user.user_id,
      tokens.refresh_token,
    );

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: {
        id: user.entity_id,
        email: user.email,
        type: user.user_type,
        employee_roles: user.employee_roles,
      },
    };
  }

  // Validates the user, generates new tokens, and updates the refresh token hash in the database.
  async refreshTokens(userId: string) {
    // We need to fetch the base user and convert it to JwtUser representation
    const userForAuth = await this.usersService.findOne(
      { id: userId },
      undefined,
      ['candidate', 'employee'],
    );

    let entity_id: string;
    let employee_roles: string[] | undefined;

    if (userForAuth.user_type === UserType.CANDIDATE && userForAuth.candidate) {
      entity_id = userForAuth.candidate.id;
    } else if (
      userForAuth.user_type === UserType.EMPLOYEE &&
      userForAuth.employee
    ) {
      entity_id = userForAuth.employee.id;
      employee_roles = userForAuth.employee.roles;
    }

    const jwtUser: JwtUser = {
      user_id: userForAuth.id,
      email: userForAuth.email,
      user_type: userForAuth.user_type,
      entity_id,
      employee_roles,
    };

    const tokens = await this.getTokens(jwtUser);
    await this.usersService.updateRefreshTokenHash(
      userForAuth.id,
      tokens.refresh_token,
    );

    return tokens;
  }

  // Revokes the user's refresh token by setting its hash to null in the database.
  async logout(userId: string) {
    await this.usersService.updateRefreshTokenHash(userId, null);
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
