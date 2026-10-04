import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOfferSkill } from './entity/job-offer-skill.entity';
import { CandidateSkillAnswer } from './entity/candidate-skill-answer.entity';
import { JobOfferSkillService } from './job-offer-skill.service';
import { CandidateSkillAnswerService } from './candidate-skill-answer.service';
import { JobOfferSkillController } from './job-offer-skill.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobOfferSkill, CandidateSkillAnswer]),
  ],
  controllers: [JobOfferSkillController],
  providers: [JobOfferSkillService, CandidateSkillAnswerService],
  exports: [JobOfferSkillService, CandidateSkillAnswerService],
})
export class JobOfferSkillsModule {}
