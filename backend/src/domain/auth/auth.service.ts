import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/base-user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtUser } from '../users/interfaces/jwt.user';
import { RegisterCandidateDto } from '../users/dto/user/create-user.dto';
import { AUTH } from '../../shared/constants/auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  //Used in local strategy
  async validateUser(email: string, password: string): Promise<JwtUser> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Fetch the specific entity (candidate or employee) to get the entity_id
      return await this.usersService.findUserWithEntity(user.id);
    }
    return null;
  }

  async login(user: JwtUser) {
    const payload = {
      email: user.email,
      sub: user.entity_id, // Use entity_id as the subject
      role: user.user_type,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.entity_id, // Return entity_id as the main ID
        email: user.email,
        role: user.user_type,
      },
    };
  }

  async register(registerCandidate: RegisterCandidateDto) {
    // Check if user already exists by email
    const existingUser = await this.usersService.findByEmail(
      registerCandidate.email,
    );

    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      registerCandidate.password,
      AUTH.BCRYPT_SALT_ROUNDS,
    );

    const user = await this.usersService.registerCandidate({
      ...registerCandidate,
      password: hashedPassword,
    });

    const { password, ...result } = user;

    return result;
  }

  async getProfileByEntity(entityId: string, userType: JwtUser['user_type']) {
    const user = await this.usersService.findUserByEntityId(entityId, userType);
    return user;
  }
}
