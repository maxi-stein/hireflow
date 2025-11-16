import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOptionsSelect,
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

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

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
        select: this.getEmployeeSelectFields(),
      });
      return employeeWithRelations;
    });
  }
  async findAll(
    paginationDto: PaginationDto = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<Employee>> {
    const [employees, total] = await this.employeeRepository.findAndCount({
      relations: { user: true },
      select: this.getEmployeeSelectFields(),
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
      relations: { user: true },
      select: this.getEmployeeSelectFields(),
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

    return employee;
  }

  private getEmployeeSelectFields(): FindOptionsSelect<Employee> {
    return {
      id: true,
      roles: true,
      position: true,
      user: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    };
  }
}
