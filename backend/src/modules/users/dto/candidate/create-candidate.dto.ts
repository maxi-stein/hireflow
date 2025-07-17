import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsUrl,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateEducationDto } from '../education/create-education.dto';
import { CreateUserDto } from '../user/create-user.dto';

export class CreateCandidateDto {
  @IsInt()
  age: number;

  @IsString()
  phone: string;

  @IsUrl()
  resume_url: string;

  @IsUrl()
  portfolio_url: string;

  @IsOptional()
  @IsUrl()
  github?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateEducationDto)
  educations?: CreateEducationDto[];
}
