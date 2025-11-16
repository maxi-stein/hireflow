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
import { JwtUser } from '../users/interfaces/jwt.user';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //Candidates use this endpoint to register.
  @UseGuards(JwtAuthGuard)
  @Post('register')
  async register(@Body() registerCandidateDto: RegisterCandidateDto) {
    return this.authService.register(registerCandidateDto);
  }

  // Login for candidates and employees
  @UseGuards(LocalAuthGuard) // Sets Request.user (if credentials are valid) or throws unauthorized exception
  @Post('login')
  async login(@Request() req: Request & { user: JwtUser }) {
    return this.authService.login(req.user);
  }

  // Get all profile information for the user
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: Request & { user: JwtUser }) {
    return this.authService.getProfileByEntity(
      req.user.entity_id,
      req.user.user_type,
    );
  }
}
