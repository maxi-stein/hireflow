import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EmployeeRole } from '../../interfaces/user.enum';

export class UpdateEmployeeDto {
  @IsEnum(EmployeeRole)
  @IsOptional()
  role?: EmployeeRole;

  @IsString()
  @IsOptional()
  position?: string;
}
