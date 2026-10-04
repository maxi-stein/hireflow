import { PartialType } from '@nestjs/mapped-types';
import { CreateJobOfferDto } from './create-job-offer.dto';
import { JobOfferStatus } from '../interfaces';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateJobOfferDto extends PartialType(CreateJobOfferDto) {
  @IsEnum(JobOfferStatus)
  @IsOptional()
  status?: JobOfferStatus;
}
