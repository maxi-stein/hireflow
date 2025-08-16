import { IsString, IsEmail, IsEnum } from 'class-validator';
import { UserType } from '../../interfaces';

export class UpdateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
