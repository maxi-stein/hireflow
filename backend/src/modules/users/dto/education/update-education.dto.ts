import { Type } from 'class-transformer';
import { IsString, IsEnum, IsDate, IsOptional } from 'class-validator';
import { DegreeType } from '../../interfaces';

export class UpdateEducationDto {
  @IsString()
  institution?: string;

  @IsEnum(DegreeType)
  degree_type?: DegreeType;

  @IsString()
  field_of_study?: string;

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
