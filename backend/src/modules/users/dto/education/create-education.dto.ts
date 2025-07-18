import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { DegreeType } from '../../interfaces';
import { Type } from 'class-transformer';

export class CreateEducationDto {
  @IsString()
  institution: string;

  @IsEnum(DegreeType)
  degree_type: DegreeType;

  @IsString()
  field_of_study: string;

  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end_date: Date | null;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  candidate_id: string;
}
