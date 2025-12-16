import {
  Controller,
  Get,
  Param,
  Body,
  Delete,
  Query,
  UseGuards,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EmployeesService } from './employee.service';
import { UpdateEmployeeDto } from '../dto/employee/update-employee.dto';
import { CreateEmployeeUserDto } from '../dto/user/create-user.dto';
import { PaginationDto } from '../../../shared/dto/pagination/pagination.dto';
import { UuidValidationPipe, NotEmptyDtoPipe } from '../../../shared/pipes';
import { JwtAuthGuard } from 'src/domain/auth/guards/jwt-auth.guard';
import { RequireUserType } from '../../auth/decorators/roles.decorator';
import { UserTypeGuard } from '../../auth/guards/roles.guard';
import { UserType } from '../interfaces/user.enum';

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // Used for creating employees administratively (by other employees)
  @Post()
  @UseGuards(UserTypeGuard)
  @RequireUserType(UserType.EMPLOYEE)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createEmployeeUserDto: CreateEmployeeUserDto) {
    return this.employeesService.createEmployee(createEmployeeUserDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.employeesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body(NotEmptyDtoPipe) updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id', UuidValidationPipe) id: string) {
    return this.employeesService.remove(id);
  }
}
