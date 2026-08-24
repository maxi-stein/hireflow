import { Type } from 'class-transformer';
import {
  IsString,
  IsUrl,
  IsOptional,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { CreateEducationDto } from '../education/create-education.dto';
import { CreateWorkExperienceDto } from '../work-experience/create-work-experience.dto';

export class CreateCandidateDto {
  @IsDateString()
  date_of_birth: Date;

  @IsString()
  phone: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsUrl()
  resume_url: string;

  @IsUrl()
  portfolio_url: string;

  @IsOptional()
  @IsUrl()
  github?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateEducationDto)
  educations?: CreateEducationDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkExperienceDto)
  work_experiences?: CreateWorkExperienceDto[];
}
