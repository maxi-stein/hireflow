import { IsOptional, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkExperienceDto } from './create-work-experience.dto';

export class UpdateWorkExperienceDto extends PartialType(
  CreateWorkExperienceDto,
) {
  @IsOptional()
  @IsUUID()
  id?: string;
}
