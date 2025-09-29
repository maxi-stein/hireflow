import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('appConfig');

  // CORS
  if (appConfig.cors?.enabled) {
    app.enableCors({
      origin: (origin, callback) => {
        // Allow non-browser clients (no Origin) and configured origins
        if (!origin) return callback(null, true);
        const allowed = appConfig.cors.origins || [];
        if (allowed.length === 0 || allowed.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('CORS not allowed'), false);
      },
    });
  }

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Transform payloads to be objects typed according to their DTO classes
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit conversion
      },
    }),
  );

  // set port
  await app.listen(appConfig.port);
}
bootstrap();
