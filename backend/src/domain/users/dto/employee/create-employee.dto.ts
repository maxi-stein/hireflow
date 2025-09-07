import { IsEnum, IsString, IsUUID, MaxLength } from 'class-validator';
import { EMPLOYEE } from 'src/shared/constants/user.constants';
import { EmployeeRole } from '../../interfaces/user.enum';

export class CreateEmployeeDto {
  @IsEnum(EmployeeRole)
  role: EmployeeRole;

  @IsString()
  @MaxLength(EMPLOYEE.MAX_POSITION_LENGTH)
  position: string;
}
