import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/domain/users/interfaces/user.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...allRoles: UserType[]) =>
  SetMetadata(ROLES_KEY, allRoles);
