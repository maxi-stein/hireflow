import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateApplicationModule } from '../candidate-application/candidate-application.module';
import { InterviewModule } from '../interviews/interview.module';
import { InterviewReview } from './entity/interview-review.entity';
import { InterviewReviewController } from './interview-review.controller';
import { InterviewReviewService } from './interview-review.service';
import { EmployeesModule } from '../users/employee/employee.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InterviewReview]),
    EmployeesModule,
    InterviewModule,
    CandidateApplicationModule,
  ],
  controllers: [InterviewReviewController],
  providers: [InterviewReviewService],
  exports: [InterviewReviewService],
})
export class InterviewReviewModule {}
