import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WorkMode } from '../interfaces/work-mode.enum';
import { Type } from 'class-transformer';
import { CreateJobOfferSkillDto } from '../../job-offer-skills/dto/create-job-offer-skill.dto';

export class CreateJobOfferDto {
  @IsString()
  position: string;

  @IsString()
  location: string;

  @IsEnum(WorkMode)
  work_mode: WorkMode;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJobOfferSkillDto)
  skills?: CreateJobOfferSkillDto[];
}
