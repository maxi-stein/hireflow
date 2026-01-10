import { IsString, MaxLength, MinLength } from 'class-validator';
import { AUTH } from '../../../shared/constants/auth.constants';

const { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } = AUTH;

export class ChangePasswordDto {
  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  newPassword: string;

  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  oldPassword: string;
}
