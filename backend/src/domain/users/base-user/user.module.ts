import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsModule } from 'src/domain/auth/guards/guards.module';
import { CandidateService } from '../candidate/candidate.service';
import { EmployeesService } from '../employee/employee.service';
import { User, Employee, Candidate, Education } from '../entities';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { EducationService } from '../education/education.service';
import { WorkExperienceService } from '../work-experience/work-experience.service';
import { WorkExperience } from '../entities/work-experience.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Employee,
      Candidate,
      Education,
      WorkExperience,
    ]),
    GuardsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    EmployeesService,
    CandidateService,
    EducationService,
    WorkExperienceService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
