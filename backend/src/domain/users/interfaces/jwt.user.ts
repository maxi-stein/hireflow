import { UserType } from './user.enum';

export interface JwtUser {
  id: string;
  email: string;
  user_type: UserType;
  entity_id: string; // This will be either candidate_id or employee_id
}
