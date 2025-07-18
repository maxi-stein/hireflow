import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/base-user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtUser } from '../users/interfaces/jwt.user';
import { CreateUserDto } from '../users/dto/user/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<JwtUser> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { email, id, user_type } = user;
      return { email, id, user_type };
    }
    return null;
  }

  async login(user: JwtUser) {
    const payload = { email: user.email, sub: user.id, role: user.user_type };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.user_type,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const { password, ...result } = user;
    return result;
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);
    return user;
  }
}
