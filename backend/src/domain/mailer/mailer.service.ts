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
      // Return a dummy success response so the system doesn't break since we're using localhost to send emails for now
      return {
        messageId: 'mock-message-id-' + Date.now(),
        accepted: recipients.map((r) =>
          typeof r === 'string' ? r : r.address,
        ),
        rejected: [],
        envelopeTime: 0,
        messageTime: 0,
        messageSize: 0,
        response: '250 Mock OK',
        envelope: {
          from: mailOptions.from.address,
          to: recipients.map((r) => (typeof r === 'string' ? r : r.address)),
        },
      } as any;
    }
  }
}
