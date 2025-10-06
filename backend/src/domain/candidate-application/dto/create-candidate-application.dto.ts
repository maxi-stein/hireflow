import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { CreateCandidateSkillAnswerDto } from '../../job-offer/job-offer-skills/dto/create-candidate-skill-answer.dto';

export class CreateCandidateApplicationDto {
  @IsUUID()
  job_offer_id: string;

  @IsUUID()
  candidate_id: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCandidateSkillAnswerDto)
  skill_answers?: CreateCandidateSkillAnswerDto[];
}
