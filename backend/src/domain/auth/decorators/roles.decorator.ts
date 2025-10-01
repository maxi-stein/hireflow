import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/domain/users/interfaces/user.enum';

export const USER_TYPES_KEY = 'user_types';
export const RequireUserType = (...userTypes: UserType[]) =>
  SetMetadata(USER_TYPES_KEY, userTypes);
