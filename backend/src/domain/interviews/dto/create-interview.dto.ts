import {
  IsEnum,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InterviewStatus } from '../interfaces/interview-status.enum';
import { InterviewType } from '../interfaces/interview-type.enum';

export class CreateInterviewDto {
  @IsEnum(InterviewType)
  type: InterviewType;

  @IsDate()
  @Type(() => Date)
  scheduled_time: Date;

  @IsOptional()
  @IsString()
  meeting_link?: string;

  @IsOptional()
  @IsEnum(InterviewStatus)
  status?: InterviewStatus;

  @IsArray()
  @IsUUID('4', { each: true })
  application_ids: string[]; //One interview if individual or +1 interviews for grupal

  @IsArray()
  @IsUUID('4', { each: true })
  interviewer_ids: string[];
}
