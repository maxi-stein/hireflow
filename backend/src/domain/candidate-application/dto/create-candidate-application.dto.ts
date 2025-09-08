import { IsUUID } from 'class-validator';

export class CreateCandidateApplicationDto {
  @IsUUID()
  job_offer_id: string;

  @IsUUID()
  candidate_id: string;
}
