import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterCandidateDto } from '../users/dto/user/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //Candidates use this endpoint to register.
  @UseGuards(JwtAuthGuard)
  @Post('register')
  async register(@Body() registerCandidateDto: RegisterCandidateDto) {
    return this.authService.register(registerCandidateDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfileByEntity(
      req.user.entity_id,
      req.user.user_type,
    );
  }
}
