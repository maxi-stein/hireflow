import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate, Education } from '../entities';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { EducationService } from '../education/education.service';
import { WorkExperienceService } from '../work-experience/work-experience.service';
import { WorkExperience } from '../entities/work-experience.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate, Education, WorkExperience])],
  controllers: [CandidateController],
  providers: [CandidateService, EducationService, WorkExperienceService],
  exports: [CandidateService],
})
export class CandidateModule {}
