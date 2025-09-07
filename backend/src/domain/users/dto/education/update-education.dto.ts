// update-education.dto.ts
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { DegreeType } from '../../interfaces/education.enum';

export class UpdateEducationDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  @IsEnum(DegreeType)
  degree_type?: DegreeType;

  @IsOptional()
  @IsString()
  field_of_study?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start_date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end_date?: Date | null;

  @IsOptional()
  @IsString()
  description?: string;
}
