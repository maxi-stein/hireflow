import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/domain/auth/auth.controller';
import { AuthService } from '../../../src/domain/auth/auth.service';
import { JwtUser } from '../../../src/domain/users/interfaces/jwt.user';
import { UserType } from '../../../src/domain/users/interfaces/user.enum';
import { User } from '../../../src/domain/users/entities';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let configService: ConfigService;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      refreshTokens: jest.fn(),
      logout: jest.fn(),
      getProfileByEntity: jest.fn(),
      changePassword: jest.fn(),
      resetPassword: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'auth') {
          return {
            secret: 'secret',
            expiresIn: 3600,
            refreshSecret: 'refresh-secret',
            refreshExpiresIn: '7d',
            refreshCookieMaxAge: 604800000,
          };
        }
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('login', () => {
    it('should call AuthService.login with req.user and set the Refresh cookie', async () => {
      const user: JwtUser = {
        user_id: 'user-123',
        email: 'test@mail.com',
        entity_id: 'cand-123',
        user_type: UserType.CANDIDATE,
      };

      const req: any = { user };
      const res: any = {
        cookie: jest.fn(),
      };

      const expectedServiceResponse = {
        access_token: 'access-token-123',
        refresh_token: 'refresh-token-123',
        user: {
          id: user.entity_id,
          email: user.email,
          type: user.user_type,
          employee_roles: undefined as string[],
        },
      };

      authService.login.mockResolvedValue(expectedServiceResponse);

      const result = await controller.login(req, res);

      expect(authService.login).toHaveBeenCalledWith(user);
      expect(res.cookie).toHaveBeenCalledWith(
        'Refresh',
        'refresh-token-123',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          path: '/auth/refresh',
          maxAge: 604800000,
        }),
      );
      expect(result).toEqual({
        access_token: 'access-token-123',
        user: expectedServiceResponse.user,
      });
    });
  });

  describe('refresh', () => {
    it('should call AuthService.refreshTokens and update the Refresh cookie', async () => {
      const req: any = {
        user: {
          id: 'user-123',
        },
      };
      const res: any = {
        cookie: jest.fn(),
      };

      const expectedTokens = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      };

      authService.refreshTokens.mockResolvedValue(expectedTokens);

      const result = await controller.refresh(req, res);

      expect(authService.refreshTokens).toHaveBeenCalledWith('user-123');
      expect(res.cookie).toHaveBeenCalledWith(
        'Refresh',
        'new-refresh-token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          path: '/auth/refresh',
          maxAge: 604800000,
        }),
      );
      expect(result).toEqual({ access_token: 'new-access-token' });
    });
  });

  describe('logout', () => {
    it('should call AuthService.logout and clear the Refresh cookie', async () => {
      const user: JwtUser = {
        user_id: 'user-123',
        email: 'test@mail.com',
        entity_id: 'cand-123',
        user_type: UserType.CANDIDATE,
      };
      const req: any = { user };
      const res: any = {
        clearCookie: jest.fn(),
      };

      authService.logout.mockResolvedValue(undefined);

      const result = await controller.logout(req, res);

      expect(authService.logout).toHaveBeenCalledWith('user-123');
      expect(res.clearCookie).toHaveBeenCalledWith(
        'Refresh',
        expect.objectContaining({
          path: '/auth/refresh',
          httpOnly: true,
          sameSite: 'strict',
        }),
      );
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });

  describe('profile', () => {
    it('should call AuthService.getProfileByEntity with entity_id and user_type', async () => {
      const req: any = {
        user: {
          entity_id: 'cand-123',
          user_type: UserType.CANDIDATE,
        },
      };

      const expectedProfile = {
        id: 'cand-123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@mail.com',
        user_type: UserType.CANDIDATE,
      } as User;

      authService.getProfileByEntity.mockResolvedValue(expectedProfile);

      const result = await controller.getProfile(req);

      expect(authService.getProfileByEntity).toHaveBeenCalledWith(
        'cand-123',
        UserType.CANDIDATE,
      );
      expect(result).toEqual(expectedProfile);
    });
  });

  describe('changePassword', () => {
    it('should call AuthService.changePassword with user_id and dto', async () => {
      const req: any = {
        user: {
          user_id: 'user-123',
        },
      };
      const dto = {
        oldPassword: 'old-password',
        newPassword: 'new-password',
      };

      authService.changePassword.mockResolvedValue({
        user: {} as User,
        affected: 1,
      });

      const result = await controller.changePassword(req, dto);

      expect(authService.changePassword).toHaveBeenCalledWith('user-123', dto);
      expect(result).toEqual({ user: {}, affected: 1 });
    });
  });

  describe('resetPassword', () => {
    it('should call AuthService.resetPassword with req.user.email', async () => {
      const req: any = {
        user: {
          email: 'test@mail.com',
        },
      };

      authService.resetPassword.mockResolvedValue({
        message: 'Password reset successful. Check your email for the new password.',
      });

      const result = await controller.resetPassword(req);

      expect(authService.resetPassword).toHaveBeenCalledWith('test@mail.com');
      expect(result).toEqual({
        message: 'Password reset successful. Check your email for the new password.',
      });
    });
  });
});
