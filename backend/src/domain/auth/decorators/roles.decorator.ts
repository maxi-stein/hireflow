import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/domain/users/interfaces/user.enum';

export const USER_TYPES_KEY = 'user_types';

// Set the metadata: user_types = [UserType.EMPLOYEE] (or CANDIDATE)
export const RequireUserType = (...userTypes: UserType[]) =>
  SetMetadata(USER_TYPES_KEY, userTypes);
