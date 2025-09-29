import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ReviewStatus } from '../interface/review-status.enum';

export class CreateInterviewReviewDto {
  @IsUUID()
  employee_id: string;

  @IsUUID()
  interview_id: string;

  @IsUUID()
  candidate_application_id: string;

  @IsEnum(ReviewStatus)
  status: ReviewStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  score?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  strengths?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  weaknesses?: string[];
}
