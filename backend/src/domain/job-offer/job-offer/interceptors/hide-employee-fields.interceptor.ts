import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HideEmployeeFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const isEmployee = request.user?.type === 'employee';

    return next.handle().pipe(
      map((data) => {
        // If the user is an employee or there's no data, return it intact
        if (isEmployee || !data) return data;

        const cleanOffer = (offer: any) => {
          delete offer.deadline;
          delete offer.applicants_count;
        };

        // If it's a paginated response (list), clean the array, else clean the object (findOne)
        if (data.data && Array.isArray(data.data)) {
          data.data.forEach(cleanOffer);
        } else {
          cleanOffer(data);
        }

        return data;
      }),
    );
  }
}
