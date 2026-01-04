import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { JobOfferModule } from '../job-offer/job-offer/job-offer.module';
import { CandidateApplicationModule } from '../candidate-application/candidate-application.module';
import { InterviewModule } from '../interviews/interview.module';
import { InterviewReviewModule } from '../interview-review/interview-review.module';

@Module({
  controllers: [DashboardController],
  imports: [
    JobOfferModule,
    CandidateApplicationModule,
    InterviewModule,
    InterviewReviewModule,
  ],
  providers: [DashboardService],
})
export class DashboardModule {}
