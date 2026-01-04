import { IsUUID } from 'class-validator';

export class HireCandidateApplicationDto {
  @IsUUID()
  applicationId: string;
}
