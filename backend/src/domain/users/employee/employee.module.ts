import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee, Education } from '../entities';
import { EmployeesController } from './employee.controller';
import { EmployeesService } from './employee.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Education])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
