import {
  IsString,
  IsDate,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWorkExperienceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  company_name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  position: string;

  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end_date?: Date | null;

  @IsOptional()
  @IsString()
  description?: string;
}
