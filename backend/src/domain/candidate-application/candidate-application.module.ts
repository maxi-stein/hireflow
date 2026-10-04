import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateApplication } from './entities/candidate-application.entity';
import { CandidateApplicationController } from './candidate-application.controller';
import { CandidateApplicationService } from './candidate-application.service';
import { JobOfferModule } from '../job-offer/job-offer.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateApplication]),
    JobOfferModule,  // already exports JobOfferSkillsModule (JobOfferSkillService + CandidateSkillAnswerService)
    MailerModule,
  ],
  controllers: [CandidateApplicationController],
  providers: [CandidateApplicationService],
  exports: [CandidateApplicationService],
})
export class CandidateApplicationModule {}
