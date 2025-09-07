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
  @IsArray()
  @IsString({ each: true })
  positions?: string[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
