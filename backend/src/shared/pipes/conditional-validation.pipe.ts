// conditional-validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { UserType } from 'src/domain/users/interfaces';

@Injectable()
export class ConditionalValidationPipe implements PipeTransform {
  transform(value: any) {
    const { user_type, employeeData, candidateData } = value;

    if (user_type === UserType.EMPLOYEE && !employeeData) {
      throw new BadRequestException(
        'employeeData is required for EMPLOYEE users',
      );
    }

    if (user_type === UserType.CANDIDATE && !candidateData) {
      throw new BadRequestException(
        'candidateData is required for CANDIDATE users',
      );
    }

    return value;
  }
}
