import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto } from '../dto/employee/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/employee/update-employee.dto';
import { User } from '../entities/user.entity';
import {
  PaginationDto,
  PaginatedResponse,
} from '../../../shared/dto/pagination/pagination.dto';
import { CreateEmployeeUserDto } from '../dto/user/create-user.dto';
import { UserType } from '../interfaces/user.enum';
import { UsersService } from '../base-user/user.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly usersService: UsersService,
  ) {}

  // Internal method: creates employee profile for existing user
  async create(
    userId: string,
    createEmployeeDto: CreateEmployeeDto,
    entityManager?: EntityManager,
  ): Promise<Employee> {
    return this.employeeRepository.manager.transaction(async () => {
      const manager = entityManager || this.employeeRepository.manager;

      // Create employee
      const employee = manager.create(Employee, {
        roles: createEmployeeDto.roles,
        position: createEmployeeDto.position,
        user: { id: userId } as User,
      });

      const savedEmployee = await manager.save(employee);

      // Get the saved employee with relations for mapping
      const employeeWithRelations = await manager.findOne(Employee, {
        where: { id: savedEmployee.id },
        relations: { user: true },
      });

      return employeeWithRelations;
    });
  }

  // Public method for creating employees administratively (by other employees)
  async createEmployee(
    createEmployeeUserDto: CreateEmployeeUserDto,
  ): Promise<User> {

    // Check for duplicate email
    const existingUser = await this.usersService.findOne({
      email: createEmployeeUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException(
        `Email ${createEmployeeUserDto.email} is already in use`,
      );
    }

    return this.employeeRepository.manager.transaction(
      async (transactionalEntityManager) => {        
        const user = await this.usersService.create(
          {
            first_name: createEmployeeUserDto.first_name,
            last_name: createEmployeeUserDto.last_name,
            email: createEmployeeUserDto.email,
            password: createEmployeeUserDto.password,
          },
          UserType.EMPLOYEE,
          transactionalEntityManager,
        );

        // Create the employee profile
        await this.create(
          user.id,
          createEmployeeUserDto.employeeData,
          transactionalEntityManager,
        );

        // Return the user with employee relation
        return transactionalEntityManager.findOne(User, {
          where: { id: user.id },
          relations: ['employee'],
        });
      },
    );
  }

  async findAll(
    paginationDto: PaginationDto = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<Employee>> {
    const [employees, total] = await this.employeeRepository.findAndCount({
      relations: { user: true },
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    });

    return {
      data: employees,
      pagination: {
        page: paginationDto.page,
        limit: paginationDto.limit,
        total,
        totalPages: Math.ceil(total / paginationDto.limit),
      },
    };
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: { user: true }
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<{ employee: Employee; affected: number }> {
    // Perform update and get result
    const updateResult: UpdateResult = await this.employeeRepository.update(
      id,
      updateEmployeeDto,
    );

    if (updateResult.affected === 0) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    // Get updated employee
    const updatedEmployee = await this.findOne(id);

    return {
      employee: updatedEmployee,
      affected: updateResult.affected,
    };
  }

  async remove(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: { user: true },
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

    return employee;
  }

}
