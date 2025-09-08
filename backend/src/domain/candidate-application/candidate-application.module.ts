import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateApplication } from './entities/candidate-application.entity';
import { CandidateApplicationController } from './candidate-application.controller';
import { CandidateApplicationService } from './candidate-application.service';

@Module({
  imports: [TypeOrmModule.forFeature([CandidateApplication])],
  controllers: [CandidateApplicationController],
  providers: [CandidateApplicationService],
  exports: [CandidateApplicationService],
})
export class CandidateApplicationModule {}
