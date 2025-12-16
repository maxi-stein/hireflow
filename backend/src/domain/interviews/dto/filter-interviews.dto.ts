import { IsOptional, IsEnum, IsUUID, IsDate } from 'class-validator';
import { PaginationDto } from '../../../shared/dto/pagination/pagination.dto';
import { InterviewStatus } from '../interfaces/interview-status.enum';
import { Type } from 'class-transformer';

export class FilterInterviewsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(InterviewStatus)
  status?: InterviewStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start_date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end_date?: Date;

  @IsOptional()
  @IsUUID()
  candidate_application_id?: string;

  @IsOptional()
  @IsUUID()
  applicationId?: string;

  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
}
