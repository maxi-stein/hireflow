import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WorkMode } from '../interfaces/work-mode.enum';

export class CreateJobOfferDto {
  @IsString()
  position: string;

  @IsString()
  location: string;

  @IsEnum(WorkMode)
  work_mode: WorkMode;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsString()
  benefits?: string;
}
