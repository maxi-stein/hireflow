import { IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../shared/dto/pagination/pagination.dto';
import { ApplicationStatus } from '../interfaces/application-status';

export class FilterApplicationsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

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
}
