import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../../shared/dto/pagination/pagination.dto';

export class FilterInterviewReviewsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  search?: string;

  @IsOptional()
  @IsUUID()
  employee_id?: string;

  @IsOptional()
  @IsUUID()
  candidate_id?: string;

  @IsOptional()
  @IsUUID()
  job_offer_id?: string;

  @IsOptional()
  @IsUUID()
  candidate_application_id?: string;

  @IsOptional()
  @IsUUID()
  interview_id?: string;
}
