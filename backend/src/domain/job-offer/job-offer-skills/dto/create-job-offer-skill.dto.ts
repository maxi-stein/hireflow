import { IsString } from 'class-validator';

export class CreateJobOfferSkillDto {
  @IsString()
  skill_name: string;
}
