import { getPasswordResetTemplate } from '../templates/password-reset-template';
import { getInterviewCreatedTemplate } from '../templates/interview-created-template';
import { getInterviewDateUpdatedTemplate } from '../templates/interview-date-updated-template';
import { getApplicationHiredTemplate } from '../templates/application-hired-template';
import { getApplicationRejectedTemplate } from '../templates/application-rejected-template';

export enum EmailTemplateType {
  PASSWORD_RESET = 'PASSWORD_RESET',
  INTERVIEW_CREATED = 'INTERVIEW_CREATED',
  INTERVIEW_DATE_UPDATED = 'INTERVIEW_DATE_UPDATED',
  APPLICATION_HIRED = 'APPLICATION_HIRED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
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
    case EmailTemplateType.INTERVIEW_CREATED:
      return getInterviewCreatedTemplate(payload);
    case EmailTemplateType.INTERVIEW_DATE_UPDATED:
      return getInterviewDateUpdatedTemplate(payload);
    case EmailTemplateType.APPLICATION_HIRED:
      return getApplicationHiredTemplate(payload);
    case EmailTemplateType.APPLICATION_REJECTED:
      return getApplicationRejectedTemplate(payload);
    default:
      throw new Error(`Unknown email template type: ${templateType}`);
  }
}
