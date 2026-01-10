import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import {
  Repository,
  UpdateResult,
  EntityManager,
  FindOptionsWhere,
} from 'typeorm';
import { User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginatedResponse,
  PaginationDto,
} from '../../../shared/dto/pagination/pagination.dto';
import { UserType } from '../interfaces/user.enum';
import { JwtUser } from '../interfaces/jwt.user';
import * as bcrypt from 'bcrypt';
import { AUTH } from '../../../shared/constants/auth.constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    userData: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
    },
    userType: UserType,
    entityManager: EntityManager,
  ): Promise<User> {
    // Check if user already exists by email
    const existingUser = await entityManager.findOne(User, {
      where: { email: userData.email },
      select: ['id'],
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      userData.password,
      AUTH.BCRYPT_SALT_ROUNDS,
    );

    // Create the user
    const user = entityManager.create(User, {
      ...userData,
      password: hashedPassword,
      user_type: userType,
    });

    return await entityManager.save(user);
  }

  async findAll(
    paginationDto: PaginationDto = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<User>> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    });

    return {
      data: users,
      pagination: {
        page: paginationDto.page,
        limit: paginationDto.limit,
        total,
        totalPages: Math.ceil(total / paginationDto.limit),
      },
    };
  }

  /**
   * Finds a user by ID.
   * @param id - User ID
   * @param entityManager - Optional transaction entity manager. If provided, uses it instead of the repository
   * @param relations - Optional relations to load (e.g., ['candidate', 'employee'])
   * @returns User entity
   * @throws NotFoundException if user is not found
   */
  async findOne(
    where: FindOptionsWhere<User>,
    entityManager?: EntityManager,
    relations?: string[],
    selectWithPassword?: boolean,
  ): Promise<User> {
    const manager = entityManager || this.userRepository.manager;

    const user = await manager.findOne(User, {
      where,
      relations,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        user_type: true,
        password: selectWithPassword || false,
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  /**
   * Finds a user by email with their related entity for authentication purposes.
   * Returns user data including password hash for credential validation.
   * The password should be validated by the caller (AuthService) and then removed.
   * @param email - User email
   * @returns JwtUser with password hash, or null if not found
   */
  async findByEmailForAuthentication(
    email: string,
  ): Promise<(JwtUser & { password: string }) | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['candidate', 'employee'],
      select: {
        id: true,
        email: true,
        password: true,
        user_type: true,
        candidate: {
          id: true,
        },
        employee: {
          id: true,
          roles: true,
        },
      },
    });

    if (!user || !user.password) {
      return null;
    }

    let entity_id: string;
    let employee_roles: string[] | undefined;

    if (user.user_type === UserType.CANDIDATE && user.candidate) {
      entity_id = user.candidate.id;
    } else if (user.user_type === UserType.EMPLOYEE && user.employee) {
      entity_id = user.employee.id;
      employee_roles = user.employee.roles;
    } else {
      return null; // Entity not found
    }

    const jwtUser: JwtUser & { password: string } = {
      user_id: user.id,
      email: user.email,
      user_type: user.user_type,
      entity_id,
      password: user.password,
    };

    if (employee_roles) {
      jwtUser.employee_roles = employee_roles;
    }

    return jwtUser;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ user: User; affected: number }> {
    // Hash password if it's included in the update
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        AUTH.BCRYPT_SALT_ROUNDS,
      );
    }

    const updateResult: UpdateResult = await this.userRepository.update(
      id,
      updateUserDto,
    );

    if (updateResult.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.findOne({ id });

    return {
      user: updatedUser,
      affected: updateResult.affected,
    };
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  /**
   * Finds the base User using an entity id (candidate_id or employee_id)
   * based on the provided user type.
   */
  async findUserByEntityId(
    entityId: string,
    userType: UserType,
  ): Promise<User> {
    let user: User | null = null;

    if (userType === UserType.CANDIDATE) {
      user = await this.userRepository.findOne({
        where: { candidate: { id: entityId } },
        relations: ['candidate'],
      });
    } else if (userType === UserType.EMPLOYEE) {
      user = await this.userRepository.findOne({
        where: { employee: { id: entityId } },
        relations: ['employee'],
      });
    } else {
      throw new BadRequestException(`Unknown user type: ${userType}`);
    }

    if (!user) {
      throw new NotFoundException(
        `User not found for ${userType} entity with ID ${entityId}`,
      );
    }

    return user;
  }
}
