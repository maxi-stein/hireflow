import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from '../../../../shared/dto/pagination/pagination.dto';

export enum CandidateSortBy {
  UPDATED_AT = 'updated_at',
  LAST_NAME = 'last_name',
}

export class CandidateFilterDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(CandidateSortBy)
  sort: CandidateSortBy = CandidateSortBy.UPDATED_AT;
}
