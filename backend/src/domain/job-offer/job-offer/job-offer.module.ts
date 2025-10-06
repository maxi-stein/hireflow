import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOfferSkill } from '../job-offer-skills/entity/job-offer-skill.entity';
import { JobOfferSkillService } from '../job-offer-skills/job-offer-skill.service';
import { JobOffer } from './entities/job-offer.entity';
import { JobOfferController } from './job-offer.controller';
import { JobOfferService } from './job-offer.service';
import { Module } from '@nestjs/common';
import { JobOfferSkillController } from '../job-offer-skills/job-offer-skill.controller';
import { CandidateSkillAnswer } from '../job-offer-skills/entity/candidate-skill-answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobOffer, JobOfferSkill, CandidateSkillAnswer]),
  ],
  controllers: [JobOfferController, JobOfferSkillController],
  providers: [JobOfferService, JobOfferSkillService],
  exports: [JobOfferService, JobOfferSkillService],
})
export class JobOfferModule {}
