import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../modules/users/user.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import authConfig from 'src/config/auth.config';
import { enviorments } from 'src/config/enviorments';
import * as Joi from 'joi';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import databaseConfig from 'src/config/database.config';
import { AuthModule } from '../modules/auth/auth.module';
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig],
      envFilePath: enviorments[process.env.NODE_ENV] || '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_PORT: Joi.number(),
        POSTGRES_HOST: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().default('1d'),
      }),
    }),
    UsersModule,
    DatabaseModule,
    AuthModule,
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
