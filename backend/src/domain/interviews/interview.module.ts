import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateApplicationModule } from '../candidate-application/candidate-application.module';
import { Interview } from './entities/interview.entity';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { EmployeesModule } from '../users/employee/employee.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interview]),
    EmployeesModule,
    CandidateApplicationModule,
    MailerModule,
  ],
  controllers: [InterviewController],
  providers: [InterviewService],
  exports: [InterviewService],
})
export class InterviewModule {}
