import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class NotEmptyDtoPipe implements PipeTransform {
  transform(value: any) {
    if (Object.keys(value).length === 0) {
      throw new BadRequestException('Update data cannot be empty');
    }
    return value;
  }
}
