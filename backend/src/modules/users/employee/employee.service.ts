import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto } from '../dto/employee/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/employee/update-employee.dto';
import { User } from '../entities/user.entity';
import { UserType } from '../interfaces';
import {
  PaginationDto,
  PaginatedResponse,
} from '../dto/pagination/pagination.dto';
import { EmployeeResponseDto } from '../dto/employee/employee-response.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeeRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Validate if the user exists
        const user = await transactionalEntityManager.findOne(User, {
          where: { id: createEmployeeDto.userId },
        });

        if (!user) {
          throw new NotFoundException(
            `User with ID ${createEmployeeDto.userId} not found`,
          );
        }

        // Validate if the user is an employee
        if (user.user_type !== UserType.EMPLOYEE) {
          throw new BadRequestException(
            `User with ID ${createEmployeeDto.userId} is not an employee type user`,
          );
        }

        // Validate if the user already has an employee profile
        const existingEmployee = await transactionalEntityManager.findOne(
          Employee,
          {
            where: { user: { id: createEmployeeDto.userId } },
          },
        );

        if (existingEmployee) {
          throw new ConflictException(
            `User ${createEmployeeDto.userId} already has an employee profile`,
          );
        }

        // Create employee
        const employee = transactionalEntityManager.create(Employee, {
          role: createEmployeeDto.role,
          position: createEmployeeDto.position,
          user: { id: createEmployeeDto.userId } as User,
        });

        const savedEmployee = await transactionalEntityManager.save(employee);

        // Get the saved employee with relations for mapping
        const employeeWithRelations = await transactionalEntityManager.findOne(
          Employee,
          {
            where: { id: savedEmployee.id },
            relations: { user: true },
            select: this.getEmployeeSelectFields(),
          },
        );

        return this.mapToResponseDto(employeeWithRelations);
      },
    );
  }
  async findAll(
    paginationDto: PaginationDto = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<EmployeeResponseDto>> {
    const [employees, total] = await this.employeeRepository.findAndCount({
      relations: { user: true },
      select: this.getEmployeeSelectFields(),
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    });

    return {
      data: employees.map(this.mapToResponseDto),
      pagination: {
        page: paginationDto.page,
        limit: paginationDto.limit,
        total,
        totalPages: Math.ceil(total / paginationDto.limit),
      },
    };
  }

  async findOne(id: string): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: { user: true },
      select: this.getEmployeeSelectFields(),
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return this.mapToResponseDto(employee);
  }

  async remove(id: string): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: { user: true },
      select: this.getEmployeeSelectFields(),
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    const deletedEmployee = await this.employeeRepository.delete(id);

    if (deletedEmployee.affected === 0) {
      throw new InternalServerErrorException(
        `Failed to delete employee with ID ${id}`,
      );
    }

    return this.mapToResponseDto(employee);
  }

  // ===== HELPER METHODS =====

  private getEmployeeSelectFields(): FindOptionsSelect<Employee> {
    return {
      id: true,
      role: true,
      position: true,
      user: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    };
  }

  private mapToResponseDto(employee: Employee): EmployeeResponseDto {
    return {
      id: employee.id,
      role: employee.role,
      position: employee.position,
      user: {
        id: employee.user.id,
        firstName: employee.user.first_name,
        lastName: employee.user.last_name,
        email: employee.user.email,
      },
    };
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    await this.employeeRepository.update(id, updateEmployeeDto);
    return this.findOne(id);
  }
}
