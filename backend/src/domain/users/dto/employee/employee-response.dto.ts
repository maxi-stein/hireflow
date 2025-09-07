import { EmployeeRole } from '../../interfaces/user.enum';

export class EmployeeResponseDto {
  id: string;
  role: EmployeeRole;
  position: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  profile_created_at: Date;
  profile_updated_at: Date;
}
