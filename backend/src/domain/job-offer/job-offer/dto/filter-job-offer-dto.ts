import {
  IsOptional,
  IsEnum,
  IsArray,
  IsString,
  IsDateString,
} from 'class-validator';
import { JobOfferStatus } from '../interfaces';
import { PaginationDto } from 'src/shared/dto/pagination/pagination.dto';

export class FilterJobOfferDto extends PaginationDto {
  @IsOptional()
  @IsEnum(JobOfferStatus)
  status?: JobOfferStatus;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsDateString()
  deadline_from?: string;

  @IsOptional()
  @IsDateString()
  deadline_to?: string;
}
