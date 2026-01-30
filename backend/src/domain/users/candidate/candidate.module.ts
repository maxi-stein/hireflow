import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate, Education, User } from '../entities';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { WorkExperience } from '../entities/work-experience.entity';
import { UsersModule } from '../base-user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Candidate, Education, WorkExperience]),
    UsersModule,
  ],
  controllers: [CandidateController],
  providers: [CandidateService],
  exports: [CandidateService],
})
export class CandidateModule {}
