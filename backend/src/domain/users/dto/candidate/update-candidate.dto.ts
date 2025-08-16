// update-candidate.dto.ts
import {
  ArrayNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateEducationDto } from '../education/update-education.dto';

export class UpdateCandidateDto {
  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUrl()
  resume_url?: string;

  @IsOptional()
  @IsUrl()
  portfolio_url?: string;

  @IsOptional()
  @IsUrl()
  github?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateEducationDto)
  @ArrayNotEmpty()
  educations?: UpdateEducationDto[];
}
