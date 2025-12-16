import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { EMPLOYEE_ROLES } from '../../../../shared/constants/user.constants';

export class UpdateEmployeeDto {
  @IsArray()
  @IsIn(EMPLOYEE_ROLES.ROLES, { each: true })
  @IsOptional()
  roles?: string[];

  @IsString()
  @IsOptional()
  position?: string;
}
