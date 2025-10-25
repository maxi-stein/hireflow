import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import {
  CreateUserDto,
  RegisterCandidateDto,
} from '../dto/user/create-user.dto';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginatedResponse,
  PaginationDto,
} from '../../../shared/dto/pagination/pagination.dto';
import { EmployeesService } from '../employee/employee.service';
import { CandidateService } from '../candidate/candidate.service';
import { UserType } from '../interfaces/user.enum';
import { JwtUser } from '../interfaces/jwt.user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly employeesService: EmployeesService,
    private readonly candidatesService: CandidateService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Check for duplicate email
        const existingUser = await transactionalEntityManager.findOne(User, {
          where: { email: createUserDto.email },
          select: ['id'],
        });
        if (existingUser) {
          throw new ConflictException(
            `Email ${createUserDto.email} is already in use`,
          );
        }

        // Create and save the user
        const user = transactionalEntityManager.create(User, createUserDto);
        const userSaved = await transactionalEntityManager.save(User, user);

        // Create related employee or candidate profile if data is provided
        switch (createUserDto.user_type) {
          case UserType.EMPLOYEE:
            if (createUserDto.employeeData) {
              await this.employeesService.create(
                userSaved.id,
                createUserDto.employeeData,
                transactionalEntityManager,
              );
            }
            break;
          case UserType.CANDIDATE:
            if (createUserDto.candidateData) {
              await this.candidatesService.create(
                userSaved.id,
                createUserDto.candidateData,
                transactionalEntityManager,
              );
            }
            break;
          default:
            throw new BadRequestException(
              `Unknown user type: ${createUserDto.user_type}`,
            );
        }
        return userSaved;
      },
    );
  }

  async registerCandidate(
    registerCandidateDto: RegisterCandidateDto,
  ): Promise<User> {
    return this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const candidate = transactionalEntityManager.create(User, {
          ...registerCandidateDto,
          user_type: UserType.CANDIDATE,
        });
        const candidateSaved = await transactionalEntityManager.save(candidate);
        await this.candidatesService.registerCandidate(
          candidateSaved.id,
          transactionalEntityManager,
        );
        return transactionalEntityManager.findOne(User, {
          where: { id: candidateSaved.id },
          relations: ['candidate'],
        });
      },
    );
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

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'user_type',
        'first_name',
        'last_name',
      ],
    });
  }

  async findUserWithEntity(userId: string): Promise<JwtUser> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['candidate', 'employee'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    let entity_id: string;

    if (user.user_type === UserType.CANDIDATE && user.candidate) {
      entity_id = user.candidate.id;
    } else if (user.user_type === UserType.EMPLOYEE && user.employee) {
      entity_id = user.employee.id;
    } else {
      throw new NotFoundException(`Entity not found for user ${userId}`);
    }

    return {
      user_id: user.id,
      email: user.email,
      user_type: user.user_type,
      entity_id,
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ user: User; affected: number }> {
    // Hash password if it's included in the update
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    const updateResult: UpdateResult = await this.userRepository.update(
      id,
      updateUserDto,
    );

    if (updateResult.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.findOne(id);

    return {
      user: updatedUser,
      affected: updateResult.affected,
    };
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.userRepository.delete(id);
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
