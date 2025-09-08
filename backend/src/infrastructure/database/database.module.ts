import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './helper';
import {
  User,
  Employee,
  Candidate,
  Education,
} from '../../domain/users/entities';
import { JobOffer } from '../../domain/job-offer/entities/job-offer.entity';
import { CandidateApplication } from '../../domain/candidate-application/entities/candidate-application.entity';

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
