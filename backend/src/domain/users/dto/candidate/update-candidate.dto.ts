// update-candidate.dto.ts
import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateCandidateDto {
  @IsOptional()
  @IsInt()
  age?: number;

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
