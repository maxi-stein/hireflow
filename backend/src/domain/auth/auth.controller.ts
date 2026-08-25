import {
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
  Body,
  Response,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { CanAccessUser } from './guards/can-access.guard';
import { JwtUser } from '../users/interfaces/jwt.user';
import { ChangePasswordDto } from './dto/ChangePasswordDto';
import { ConfigService } from '@nestjs/config';
import { getAuthConfig } from './helper';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  // Shared configuration for the HTTP-only refresh token cookie.
  private get cookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/auth/refresh',
      maxAge: getAuthConfig(this.configService).refreshCookieMaxAge,
    };
  }

  // Login for candidates and employees
  @UseGuards(LocalAuthGuard) // Sets Request.user (if credentials are valid) or throws unauthorized exception
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Request() req: Request & { user: JwtUser },
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const authData = await this.authService.login(req.user);

    // Set the refresh token in an HTTP-only cookie
    res.cookie('Refresh', authData.refresh_token, this.cookieOptions);

    const { refresh_token, ...responseBody } = authData;
    return responseBody;
  }

  // Endpoint to refresh the access token using the refresh token cookie.
  // Called by the frontend when the access token expires.
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(
    @Request() req,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    // Get both access and refresh tokens
    const tokens = await this.authService.refreshTokens(req.user.id);

    // Save new refresh token
    res.cookie('Refresh', tokens.refresh_token, this.cookieOptions);

    // Return only access token
    return { access_token: tokens.access_token };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Request() req: Request & { user: JwtUser },
    @Response() res: ExpressResponse,
  ) {
    const authData = await this.authService.login(req.user);

    // Set the refresh token in an HTTP-only cookie
    res.cookie('Refresh', authData.refresh_token, this.cookieOptions);

    // Redirect to frontend with access token
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/oauth-callback?access_token=${authData.access_token}`;

    return res.redirect(redirectUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Request() req: Request & { user: JwtUser },
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    await this.authService.logout(req.user.user_id);

    // Clear the refresh token cookie
    res.clearCookie('Refresh', {
      path: this.cookieOptions.path,
      httpOnly: true,
      secure: this.cookieOptions.secure,
      sameSite: this.cookieOptions.sameSite,
    });

    return { message: 'Logged out successfully' };
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

  @UseGuards(JwtAuthGuard, CanAccessUser)
  @Post('change-password')
  async changePassword(
    @Request() req: Request & { user: JwtUser },
    @Body() body: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.user_id, body);
  }

  @UseGuards(JwtAuthGuard, CanAccessUser)
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Request() req: Request & { user: JwtUser }) {
    return this.authService.resetPassword(req.user.email);
  }
}
