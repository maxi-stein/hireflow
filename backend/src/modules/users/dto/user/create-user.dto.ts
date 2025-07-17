import { IsString, IsEmail, IsEnum } from 'class-validator';
import { UserType } from '../../interfaces';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserType)
  user_type: UserType; //Evaluate if automatically set base on the endpoint
}
