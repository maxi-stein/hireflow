import { EmployeeRole } from '../../interfaces';

export class EmployeeResponseDto {
  id: string;
  role: EmployeeRole;
  position: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
