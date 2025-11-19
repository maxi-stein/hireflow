import { IsArray, IsIn, IsString, MaxLength } from 'class-validator';
import {
  EMPLOYEE_ROLES,
  EMPLOYEE,
} from '../../../../shared/constants/user.constants';

export class CreateEmployeeDto {
  @IsArray()
  @IsIn(EMPLOYEE_ROLES.ROLES, { each: true })
  roles: string[];

  @IsString()
  @MaxLength(EMPLOYEE.MAX_POSITION_LENGTH)
  position: string;
}
