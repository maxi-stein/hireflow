import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateApplication } from './entities/candidate-application.entity';
import { CandidateApplicationController } from './candidate-application.controller';
import { CandidateApplicationService } from './candidate-application.service';
import { CandidateSkillAnswer } from '../job-offer/job-offer-skills/entity/candidate-skill-answer.entity';
import { JobOfferModule } from '../job-offer/job-offer/job-offer.module';
import { CandidateSkillAnswerService } from '../job-offer/job-offer-skills/candidate-skill-answer.service';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateApplication, CandidateSkillAnswer]),
    JobOfferModule,
    MailerModule,
  ],
  controllers: [CandidateApplicationController],
  providers: [CandidateApplicationService, CandidateSkillAnswerService],
  exports: [CandidateApplicationService],
})
export class CandidateApplicationModule {}
