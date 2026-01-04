import { IsOptional, IsEnum, IsUUID, IsDate, IsArray } from 'class-validator';
import { PaginationDto } from '../../../shared/dto/pagination/pagination.dto';
import { InterviewStatus } from '../interfaces/interview-status.enum';
import { Transform, Type } from 'class-transformer';

export class FilterInterviewsDto extends PaginationDto {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsEnum(InterviewStatus, { each: true })
  status?: Array<InterviewStatus>;

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
