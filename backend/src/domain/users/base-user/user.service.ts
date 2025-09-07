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

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ user: User; affected: number }> {
    // Perform update and get result
    const updateResult: UpdateResult = await this.userRepository.update(
      id,
      updateUserDto,
    );

    if (updateResult.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Get updated user
    const updatedUser = await this.findOne(id);

    return {
      user: updatedUser,
      affected: updateResult.affected,
    };
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.delete(id);
  }
}
