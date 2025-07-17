import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../users/interfaces';

export const ROLES_KEY = 'roles';
export const Roles = (...allRoles: UserType[]) =>
  SetMetadata(ROLES_KEY, allRoles);
