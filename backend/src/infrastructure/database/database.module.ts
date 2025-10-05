import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './helper';
import {
  User,
  Employee,
  Candidate,
  Education,
} from '../../domain/users/entities';
import { CandidateApplication } from '../../domain/candidate-application/entities/candidate-application.entity';
import { Interview } from '../../domain/interviews/entities/interview.entity';
import { InterviewReview } from '../../domain/interview-review/entity/interview-review.entity';
import { JobOffer } from '../../domain/job-offer/job-offer/entities/job-offer.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const { host, port, username, password, database, logging } =
          configService.get('database') as DatabaseConfig;
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          logging,
          entities: [
            User,
            Employee,
            Candidate,
            Education,
            JobOffer,
            CandidateApplication,
            Interview,
            InterviewReview,
          ],
          autoLoadEntities: false,
          cli: {
            migrationsDir: 'src/infrastructure/database/migrations',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
