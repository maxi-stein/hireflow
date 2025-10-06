import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateCandidateSkillAnswerDto {
  @IsUUID()
  job_offer_skill_id: string;

  @IsInt()
  @Min(0)
  years_of_experience: number;
}
