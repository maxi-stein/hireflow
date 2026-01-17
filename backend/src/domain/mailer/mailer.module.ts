import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigModule } from '@nestjs/config';
import { mailerConfig } from 'src/config/mailer.config';

@Module({
  imports: [ConfigModule.forFeature(mailerConfig)],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
