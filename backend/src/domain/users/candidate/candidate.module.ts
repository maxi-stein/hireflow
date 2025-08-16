import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate, Education } from '../entities';
import { CandidatesController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { EducationService } from '../education/education.service';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate, Education])],
  controllers: [CandidatesController],
  providers: [CandidateService, EducationService],
  exports: [CandidateService],
})
export class CandidatesModule {}
