import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //retrieve app configuration
  const configService = app.get(ConfigService);
  const appConfig = configService.get('appConfig');

  // set port
  await app.listen(appConfig.port);
}
bootstrap();
