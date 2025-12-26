import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  MinLength,
  ArrayMaxSize,
  IsDateString,
} from 'class-validator';
import { WorkMode } from '../interfaces/work-mode.enum';
import { Type } from 'class-transformer';
import { CreateJobOfferSkillDto } from '../../job-offer-skills/dto/create-job-offer-skill.dto';

export class CreateJobOfferDto {
  @IsString()
  @MinLength(2)
  position: string;

  @IsString()
  @MinLength(2)
  location: string;

  @IsEnum(WorkMode)
  work_mode: WorkMode;

  @IsString()
  @MinLength(10)
  description: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => CreateJobOfferSkillDto)
  skills?: CreateJobOfferSkillDto[];
}
