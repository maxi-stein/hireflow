import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtUser } from '../../users/interfaces/jwt.user';

/**
 * Guard that ensures users can only access resources that match their ownership.
 * Works with both :id (user_id) and :candidateId/:entityId (entity_id) parameters.
 */
@Injectable()
export class CanAccessUser implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: JwtUser = request.user;

    const resourceId =
      request.params.id ||
      request.params.candidateId ||
      request.params.entityId ||
      request.params.userId;

    if (!resourceId) {
      return false;
    }

    return user.entity_id === resourceId || user.user_id === resourceId;
  }
}
