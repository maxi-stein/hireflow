import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee, Education } from '../entities';
import { EmployeesController } from './employee.controller';
import { EmployeesService } from './employee.service';
import { UsersModule } from '../base-user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Education]), UsersModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
