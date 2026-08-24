// update-candidate.dto.ts
import { IsDateString, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateCandidateDto {
  @IsOptional()
  @IsDateString()
  date_of_birth?: Date;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

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
}
