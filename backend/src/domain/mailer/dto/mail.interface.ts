import { Address } from 'nodemailer/lib/mailer';

export type SendEmailDto = {
  from?: Address;
  recipients: Address[];
  subject: string;
  html: string;
  text?: string; // Text version of the email
  placeholder_replacements?: Record<string, string>; // Placeholder replacements for the email template
};
