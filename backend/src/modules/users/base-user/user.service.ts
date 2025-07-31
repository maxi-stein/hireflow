import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginatedResponse,
  PaginationDto,
} from '../dto/pagination/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
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
    const userToUpdate = await this.userRepository.findOne({ where: { id } });
    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Perform update and get result
    const updateResult: UpdateResult = await this.userRepository.update(
      id,
      updateUserDto,
    );

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
