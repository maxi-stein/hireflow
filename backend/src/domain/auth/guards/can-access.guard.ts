import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtUser } from '../../users/interfaces/jwt.user';
import { UserType } from '../../users/interfaces/user.enum';

/**
 * Guard that ensures users can only access/modify resources that match their ownership.
 * Employees have full access. (for now until roles is implemented)
 */
@Injectable()
export class CanAccessUser implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: JwtUser = request.user;

    // 1. Employees always have access granted
    if (user.user_type === UserType.EMPLOYEE) {
      return true;
    }

    // 2. Define which keys represent user/candidate identifiers
    const possibleIdKeys = ['id', 'candidateId', 'entityId', 'userId'];
    const requestIds = new Set<string>();

    // 3. Extract IDs from Params, Body, and Query
    for (const key of possibleIdKeys) {
      if (request.params?.[key]) requestIds.add(request.params[key]);
      if (request.body?.[key]) requestIds.add(request.body[key]);
      if (request.query?.[key]) requestIds.add(request.query[key]);
    }

    // 4. If no ID is provided, assume the endpoint implicitly operates
    // on the authenticated user (e.g., /change-password) and allow it.
    if (requestIds.size === 0) {
      return true;
    }

    // 5. Validate that ALL found IDs belong to the user making the request
    for (const id of requestIds) {
      if (id !== user.entity_id && id !== user.user_id) {
        return false; // Detected an ID that doesn't belong to them -> Block
      }
    }

    return true;
  }
}
