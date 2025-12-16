import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/domain/auth/auth.controller';
import { AuthService } from '../../../src/domain/auth/auth.service';
import { RegisterCandidateDto } from '../../../src/domain/users/dto/user/create-user.dto';
import { JwtUser } from '../../../src/domain/users/interfaces/jwt.user';
import { UserType } from '../../../src/domain/users/interfaces/user.enum';
import { Candidate, User } from '../../../src/domain/users/entities';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      getProfileByEntity: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('register', () => {
    it('should call AuthService.register and return the full candidate response', async () => {
      const dto: RegisterCandidateDto = {
        email: 'test@mail.com',
        password: 'secret',
        first_name: 'John',
        last_name: 'Doe',
      };

      const expectedResponse = {
        id: '123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@mail.com',
        user_type: UserType.CANDIDATE,
        candidate: {
          id: 'cand-1',
          github: 'github-link-test',
          linkedin: 'linkedin-link-test',
          phone: '123456',
          profile_created_at: new Date(),
          profile_updated_at: undefined,
          age: 30,
          applications: [],
          educations: [],
          files: [],
        } as Candidate,
        employee: undefined,
        created_at: new Date(),
        updated_at: undefined,
      } as User;

      authService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('login', () => {
    it('should call AuthService.login with req.user', async () => {
      const user: JwtUser = {
        user_id: '1',
        email: 'test@mail.com',
        entity_id: '42',
        user_type: UserType.CANDIDATE,
      };

      const req: any = { user };
      const expectedResponse = {
        access_token: 'token',
        user: {
          id: user.user_id,
          email: user.email,
          type: user.user_type,
          employee_roles: ['admin'],
        },
      };

      authService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(req);

      expect(authService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('profile', () => {
    it('should call AuthService.getProfileByEntity with entity_id and user_type', async () => {
      const req: any = {
        user: {
          entity_id: '10',
          user_type: 'candidate',
        },
      };

      const expectedProfile = {
        id: '10',
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@mail.com',
        user_type: UserType.EMPLOYEE,
      } as User;

      authService.getProfileByEntity.mockResolvedValue(expectedProfile);

      const result = await controller.getProfile(req);

      expect(authService.getProfileByEntity).toHaveBeenCalledWith(
        '10',
        'candidate',
      );

      expect(result).toEqual(expectedProfile);
    });
  });
});
