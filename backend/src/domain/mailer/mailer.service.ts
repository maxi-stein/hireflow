import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { mailerConfig } from 'src/config/mailer.config';
import { SendEmailDto } from './dto/mail.interface';
import {
  getHtmlEmailTemplate,
  EmailTemplateType,
} from 'src/domain/mailer/utils/email-template.factory';

@Injectable()
export class MailerService {
  constructor(
    @Inject(mailerConfig.KEY)
    private readonly config: ConfigType<typeof mailerConfig>,
  ) {}

  mailTransport() {
    return createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.auth.user,
        pass: this.config.auth.pass,
      },
    });
  }

  async sendMail(
    templateType: EmailTemplateType,
    payload: any,
    recipients: SendEmailDto['recipients'],
    subject: string,
    from?: SendEmailDto['from'],
  ) {
    const transport = this.mailTransport();

    // Generate HTML from template
    const html = getHtmlEmailTemplate(templateType, payload);

    const mailOptions = {
      from: from ?? {
        address: 'notifications@hireflow.com',
        name: 'Hireflow Notifications',
      },
      to: recipients,
      subject,
      html,
    };

    try {
      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
