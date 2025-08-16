import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsModule } from 'src/domain/auth/guards/guards.module';
import { CandidateService } from '../candidate/candidate.service';
import { EmployeesService } from '../employee/employee.service';
import { User, Employee, Candidate, Education } from '../entities';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { EducationService } from '../education/education.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Employee, Candidate, Education]),
    GuardsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    EmployeesService,
    CandidateService,
    EducationService,
  ],
})
export class UsersModule {}
