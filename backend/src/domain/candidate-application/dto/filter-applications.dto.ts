import {
  IsOptional,
  IsArray,
  IsEnum,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { PaginationDto } from '../../../shared/dto/pagination/pagination.dto';
import { ApplicationStatus } from '../interfaces/application-status';
import { Transform } from 'class-transformer';

export class FilterApplicationsDto extends PaginationDto {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsEnum(ApplicationStatus, { each: true })
  status?: ApplicationStatus[];

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsUUID()
  candidate_id?: string;

  @IsOptional()
  @IsUUID()
  job_offer_id?: string;

  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  exclude_status?: ApplicationStatus;
}
