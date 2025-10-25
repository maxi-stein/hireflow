import { UserType } from './user.enum';

export interface JwtUser {
  user_id: string; // ID from users table
  email: string;
  user_type: UserType;
  entity_id: string; // This will be either candidate_id or employee_id
}
