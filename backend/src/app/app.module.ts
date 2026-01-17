import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import authConfig from 'src/config/auth.config';
import { enviorments } from 'src/config/enviorments';
import * as Joi from 'joi';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import databaseConfig from 'src/config/database.config';
import { AuthModule } from '../domain/auth/auth.module';
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';
import { UsersModule } from 'src/domain/users/base-user/user.module';
import { CandidateModule } from 'src/domain/users/candidate/candidate.module';
import { EmployeesModule } from 'src/domain/users/employee/employee.module';
import { CandidateApplicationModule } from '../domain/candidate-application/candidate-application.module';
import { InterviewModule } from '../domain/interviews/interview.module';
import { InterviewReviewModule } from '../domain/interview-review/interview-review.module';
import { JobOfferModule } from '../domain/job-offer/job-offer/job-offer.module';
import { UserFileModule } from '../domain/users/user-file/user-file.module';
import { DashboardModule } from 'src/domain/dashboard/dashboard.module';
import { WorkExperienceModule } from '../domain/users/work-experience/work-experience.module';
import { EducationModule } from '../domain/users/education/education.module';
import { MailerModule } from '../domain/mailer/mailer.module';
import { mailerConfig } from 'src/config/mailer.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, mailerConfig],
      envFilePath: enviorments[process.env.NODE_ENV] || '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number(),
        CORS_ENABLED: Joi.boolean().default(true),
        CORS_ORIGINS: Joi.string().allow('').default(''),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_PORT: Joi.number(),
        POSTGRES_HOST: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().default(1800),
        SMTP_HOST: Joi.string().required(),
        SMTP_PORT: Joi.number().required(),
        SMTP_USER: Joi.string().required(),
        SMTP_PASSWORD: Joi.string().required(),
      }),
    }),
    UsersModule,
    EmployeesModule,
    CandidateModule,
    UserFileModule,
    WorkExperienceModule,
    EducationModule,
    JobOfferModule,
    CandidateApplicationModule,
    InterviewModule,
    InterviewReviewModule,
    DashboardModule,
    DatabaseModule,
    AuthModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
