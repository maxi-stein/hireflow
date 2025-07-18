import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesController } from './employee/employee.controller';
import { EmployeesService } from './employee/employee.service';
import { Employee, Education } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Education])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
