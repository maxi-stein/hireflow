import { getPasswordResetTemplate } from '../templates/password-reset-template';

export enum EmailTemplateType {
  PASSWORD_RESET = 'PASSWORD_RESET',
}

/**
 * @param templateType - Type of email template to generate
 * @param payload - Data to populate the template
 * @returns HTML string for the email
 * @throws Error if template type is invalid or payload validation fails
 */
export function getHtmlEmailTemplate(
  templateType: EmailTemplateType,
  payload: any,
): string {
  switch (templateType) {
    case EmailTemplateType.PASSWORD_RESET:
      return getPasswordResetTemplate(payload);
    default:
      throw new Error(`Unknown email template type: ${templateType}`);
  }
}
