import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '../interfaces/application-status';

export class UpdateCandidateApplicationDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
