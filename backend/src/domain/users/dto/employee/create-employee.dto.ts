import { IsEnum, IsString, IsUUID, MaxLength } from 'class-validator';
import { EmployeeRole } from '../../interfaces';
import { EMPLOYEE } from 'src/shared/constants/user.constants';

export class CreateEmployeeDto {
  @IsEnum(EmployeeRole)
  role: EmployeeRole;

  @IsString()
  @MaxLength(EMPLOYEE.MAX_POSITION_LENGTH)
  position: string;
}
