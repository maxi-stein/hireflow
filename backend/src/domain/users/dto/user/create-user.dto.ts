import {
  IsString,
  IsEmail,
  IsEnum,
  ValidateIf,
  Min,
  Max,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateEmployeeDto } from '../employee/create-employee.dto';
import { CreateCandidateDto } from '../candidate/create-candidate.dto';
import { UserType } from '../../interfaces/user.enum';
import { AUTH } from '../../../../shared/constants/auth.constants';

const { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } = AUTH;

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Min(MIN_PASSWORD_LENGTH)
  @Max(MAX_PASSWORD_LENGTH)
  password: string;

  @IsEnum(UserType)
  user_type: UserType; //Evaluate if automatically set base on the endpoint

  @ValidateIf((o) => o.user_type === UserType.EMPLOYEE)
  @ValidateNested()
  @Type(() => CreateEmployeeDto)
  employeeData?: CreateEmployeeDto;

  @ValidateIf((o) => o.user_type === UserType.CANDIDATE)
  @ValidateNested()
  @Type(() => CreateCandidateDto)
  candidateData?: CreateCandidateDto;
}

export class RegisterCandidateDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
