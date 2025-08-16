import { UserType } from './user.enum';

export interface JwtUser {
  id: string;
  email: string;
  user_type: UserType;
}
