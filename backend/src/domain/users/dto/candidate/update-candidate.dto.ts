import { IsDate, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCandidateDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  headline?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
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
