import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFile } from '../entities/user-files.entity';
import { FileController } from './user-file.controller';
import { FileStorageService } from './user-file.service';
import { UsersModule } from '../base-user/user.module';
import { CandidateModule } from '../candidate/candidate.module';
import { EmployeesModule } from '../employee/employee.module';
import { Candidate, Employee, User } from '../entities';
import { CanAccessUser } from '../../auth/guards/can-access.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserFile, User, Employee, Candidate]),
    UsersModule,
    CandidateModule,
    EmployeesModule,
  ],
  controllers: [FileController],
  providers: [FileStorageService, CanAccessUser],
  exports: [FileStorageService],
})
export class UserFileModule {}
