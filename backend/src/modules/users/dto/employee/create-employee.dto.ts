import { IsEnum, IsString } from 'class-validator';
import { EmployeeRole } from '../../interfaces';

export class CreateEmployeeDto {
  @IsEnum(EmployeeRole)
  role: EmployeeRole;

  @IsString()
  position: string;
}
